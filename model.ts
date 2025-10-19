import { Plugin, moment, TFile } from "obsidian";
import { getDailyNoteSettings } from "obsidian-daily-notes-interface";
import type { FutureDatesSettings } from "./settings";

// source file -> texts where day (target) is mentioned
export type Mentions = Record<string, Array<string>>;
// day file (target) -> source file -> mentions
export type FutureNotes = Record<string, Mentions>;

const dailyRe = /^\d{4}-\d{2}-\d{2}$/;

export default class Model extends EventTarget {
	notes: FutureNotes = {};

	dates: Array<string> = [];
	plugin: Plugin;
	settings: FutureDatesSettings;

	constructor(plugin: Plugin, settings: FutureDatesSettings) {
		super();

		this.plugin = plugin;
		this.settings = settings;

		const cache = plugin.app.metadataCache;
		plugin.registerEvent(
			cache.on("resolved", () => {
				this.collectNotes();
			})
		);
		this.collectNotes();
	}

	finish() {}

	async collectNotes() {
		const allLinks = this.getMergedLinks();

		const notes: FutureNotes = {};

		for (const sourcePath in allLinks) {
			// Skip files in excluded folders
			if (this.isInExcludedFolder(sourcePath)) {
				continue;
			}

			for (const targetPath in allLinks[sourcePath]) {
				const date = this.extractDate(targetPath);

				if (!date) {
					continue;
				}

				const dateCondition = this.settings.showPastDates
					|| moment(date).isAfter(moment(), "day");

				if (dateCondition) {
					if (!notes[date]) {
						notes[date] = {};
					}
					if (!notes[date][sourcePath]) {
						notes[date][sourcePath] = [];
					}

					const abstractFile =
						this.plugin.app.vault.getAbstractFileByPath(sourcePath);

					if (
						abstractFile !== null &&
						abstractFile instanceof TFile
					) {
						const content = await this.plugin.app.vault.cachedRead(
							abstractFile
						);

						const mentions = this.getSubstringsWithPattern(
							content,
							`[[${date}]]`
						);

						for (const mention of mentions) {
							notes[date][sourcePath].push(mention);
						}
					}
				}
			}
		}

		this.notes = notes;
		this.dispatchEvent(new Event("change"));
	}

	extractDates(links: Record<string, Record<string, number>>): Array<string> {
		const dates: Array<string> = [];
		Object.values(links).forEach((files) => {
			Object.keys(files).forEach((link) => {
				const r = this.extractDate(link);
				if (r) {
					dates.push(r);
				}
			});
		});
		return dates;
	}

	extractDate(fileName: string): string | null {
		// Remove .md extension
		if (fileName.endsWith(".md")) {
			fileName = fileName.slice(0, -3);
		}

		// Extract just the filename from the path (in case it includes folders)
		// Handle both forward slashes and backslashes
		const pathParts = fileName.split(/[/\\]/);
		const baseFileName = pathParts[pathParts.length - 1];

		const { format } = getDailyNoteSettings();
		if (format) {
			if (moment(baseFileName, format, true).isValid()) {
				return baseFileName;
			}
			return null;
		}

		if (dailyRe.test(baseFileName)) {
			return baseFileName;
		}

		return null;
	}

	getMergedLinks() {
		const cache = this.plugin.app.metadataCache;
		const allLinks: Record<string, Record<string, number>> = {};
		Object.assign(allLinks, cache.unresolvedLinks);

		// Merge resolved and unresolved links deep
		for (const sourceFile in cache.resolvedLinks) {
			if (!allLinks[sourceFile]) {
				allLinks[sourceFile] = {};
			}
			Object.assign(
				allLinks[sourceFile],
				cache.resolvedLinks[sourceFile]
			);
		}

		return allLinks;
	}

	getSubstringsWithPattern(text: string, pattern: string): string[] {
		const matches: string[] = [];
		const lines = text.split("\n");
		const maxContextLength = this.settings.contextLength;

		// Extract date from pattern (remove [[ and ]])
		const date = pattern.slice(2, -2);

		// Create regex to match both [[date]] and [[date|display text]]
		const dateRegex = new RegExp(`\\[\\[${this.escapeRegex(date)}(?:\\|[^\\]]+)?\\]\\]`, 'g');

		for (const line of lines) {
			// Check if line should be excluded
			if (this.shouldExcludeLine(line, pattern)) {
				continue;
			}

			// Find all matches of the date (with or without display text)
			const matchesInLine = Array.from(line.matchAll(dateRegex));

			for (const match of matchesInLine) {
				const startIndex = match.index!;
				const matchLength = match[0].length;

				let start = Math.max(startIndex - maxContextLength, 0);
				let end = Math.min(
					startIndex + matchLength + maxContextLength,
					line.length
				);

				// Extend context to include complete markdown links
				// Look for incomplete markdown links at boundaries and extend to complete them
				let substring = line.substring(start, end);

				// Check if we cut off a markdown link at the end
				// Pattern: [text](url - need to find the closing )
				const incompleteLinkMatch = substring.match(/\[([^\]]+)\]\(([^)]+)$/);
				if (incompleteLinkMatch) {
					// Find the closing ) after our current end position
					const remainingText = line.substring(end);
					const closingParenIndex = remainingText.indexOf(')');
					if (closingParenIndex !== -1 && closingParenIndex < 500) {
						// Extend end to include the complete link (max 500 chars for safety)
						end = end + closingParenIndex + 1;
						substring = line.substring(start, end);
					}
				}

				// Replace [[date]] and [[date|text]] with just date for cleaner display
				substring = substring.replace(/\[\[([^\]]+)\]\]/g, '$1');

				matches.push(substring);
			}
		}

		return matches;
	}

	shouldExcludeLine(line: string, pattern: string): boolean {
		// Exclude dates with display text (e.g., [[2025-10-19|Next Day]])
		if (this.settings.excludeDatesWithDisplayText) {
			// Check if the pattern appears with a pipe character (display text)
			const dateWithDisplayText = new RegExp(`\\[\\[${this.escapeRegex(pattern.slice(2, -2))}\\|[^\\]]+\\]\\]`);
			if (dateWithDisplayText.test(line)) {
				return true;
			}
		}

		// Exclude lines containing navigation keywords
		if (this.settings.excludeNavigationKeywords) {
			const lowerLine = line.toLowerCase();
			for (const keyword of this.settings.navigationKeywords) {
				if (lowerLine.includes(keyword.toLowerCase())) {
					return true;
				}
			}
		}

		// Exclude lines matching custom patterns
		if (this.settings.excludeCustomPatterns) {
			for (const patternStr of this.settings.customPatterns) {
				try {
					const regex = new RegExp(patternStr);
					if (regex.test(line)) {
						return true;
					}
				} catch (e) {
					// Invalid regex pattern, skip it
					console.warn(`Invalid exclusion pattern: ${patternStr}`, e);
				}
			}
		}

		return false;
	}

	escapeRegex(str: string): string {
		return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	}

	isInExcludedFolder(filePath: string): boolean {
		if (!this.settings.excludeFolders) {
			return false;
		}

		for (const excludedFolder of this.settings.excludedFolders) {
			// Check if file path starts with excluded folder path
			// Handle both with and without trailing slash
			const normalizedFolder = excludedFolder.endsWith('/')
				? excludedFolder
				: excludedFolder + '/';

			if (filePath.startsWith(normalizedFolder) || filePath.startsWith(excludedFolder + '\\')) {
				return true;
			}

			// Also check if file is directly in the folder (for files at folder root)
			const fileFolder = filePath.substring(0, filePath.lastIndexOf('/'));
			if (fileFolder === excludedFolder) {
				return true;
			}
		}

		return false;
	}
}
