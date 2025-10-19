import { ItemView, WorkspaceLeaf, Workspace, setIcon, moment, TFile } from "obsidian";
import Model, { type FutureNotes, type Mentions } from "./model";
import type ObsidianFutureDatesPlugin from "./main";
import type { DateFilter } from "./settings";

interface MentionData {
	date: string;
	context: string;
	sourcePath: string;
	folderName: string;
	folderIcon: string;
}

export default class View extends ItemView {
	static TYPE = "obsidian-future-dates-view";

	model: Model;
	workspace: Workspace;
	plugin: ObsidianFutureDatesPlugin;

	constructor(leaf: WorkspaceLeaf, model: Model, workspace: Workspace, plugin: ObsidianFutureDatesPlugin) {
		super(leaf);

		this.workspace = workspace;
		this.model = model;
		this.plugin = plugin;
		this.model.addEventListener("change", this.onModelChange.bind(this));
	}

	getViewType(): string {
		return View.TYPE;
	}

	getDisplayText(): string {
		return "Future dates";
	}

	getIcon(): string {
		return "file-clock";
	}

	async onOpen() {
		this.renderContent();
	}

	async onClose() {}

	renderContent() {
		const container = this.containerEl.children[1];
		container.empty();
		container.addClass("future-dates-view");

		// Create header with filter dropdown and gear icon
		const header = this.createHeader();
		container.appendChild(header);

		// Create content area
		const content = container.createDiv({ cls: "future-dates-content" });

		// Transform notes into flat mention list
		let mentions = this.flattenNotes(this.model.notes);

		// Apply active filter
		mentions = this.applyFilter(mentions);

		// Group mentions by month
		const monthGroups = this.groupByMonth(mentions);

		// Render month groups
		this.renderMonthGroups(content, monthGroups);
	}

	applyFilter(mentions: MentionData[]): MentionData[] {
		return this.applyFilterById(mentions, this.plugin.settings.activeFilterId);
	}

	applyFilterById(mentions: MentionData[], filterId: string): MentionData[] {
		// If "all" is selected, return all mentions
		if (filterId === "all") {
			return mentions;
		}

		// Find the filter
		const filter = this.plugin.settings.filters.find(f => f.id === filterId);

		if (!filter) {
			// Filter not found, return all mentions
			return mentions;
		}

		// Apply filter logic
		return mentions.filter(mention => {
			// Get the folder path of the mention's source file
			const folderPath = this.getFolderPath(mention.sourcePath);

			// If includeFolders is not empty, only show mentions from those folders
			if (filter.includeFolders.length > 0) {
				const isIncluded = filter.includeFolders.some(folder =>
					this.pathMatches(folderPath, folder)
				);
				if (!isIncluded) {
					return false;
				}
			}

			// Apply exclude folders
			if (filter.excludeFolders.length > 0) {
				const isExcluded = filter.excludeFolders.some(folder =>
					this.pathMatches(folderPath, folder)
				);
				if (isExcluded) {
					return false;
				}
			}

			// Apply frontmatter exclusion if enabled for this filter
			if (filter.excludeByFrontmatter) {
				if (this.isExcludedByFrontmatter(mention.sourcePath)) {
					return false;
				}
			}

			return true;
		});
	}

	getFolderPath(filePath: string): string {
		const parts = filePath.split("/");
		if (parts.length === 1) {
			return ""; // File in root
		}
		return parts.slice(0, -1).join("/");
	}

	pathMatches(filePath: string, filterPath: string): boolean {
		// Normalize paths (remove trailing slashes)
		const normalizedFilePath = filePath.replace(/\/$/, '');
		const normalizedFilterPath = filterPath.replace(/\/$/, '');

		// Check if file path starts with or equals filter path
		return normalizedFilePath === normalizedFilterPath ||
		       normalizedFilePath.startsWith(normalizedFilterPath + "/");
	}

	isExcludedByFrontmatter(filePath: string): boolean {
		const file = this.app.vault.getAbstractFileByPath(filePath);
		if (!(file instanceof TFile)) {
			return false;
		}

		const fileCache = this.app.metadataCache.getFileCache(file);
		if (!fileCache?.frontmatter) {
			return false;
		}

		// Check if the frontmatter property exists and is truthy
		const propertyValue = fileCache.frontmatter[this.plugin.settings.frontmatterProperty];
		return propertyValue === true || propertyValue === "true";
	}

	createHeader(): HTMLElement {
		const header = document.createElement("div");
		header.className = "future-dates-header";

		// Filter dropdown
		const filterContainer = header.createDiv({ cls: "future-dates-filter" });
		const filterSelect = filterContainer.createEl("select", { cls: "dropdown" });

		// Get all mentions to calculate counts
		const allMentions = this.flattenNotes(this.model.notes);
		const totalCount = allMentions.length;

		// Add "All" option with count
		filterSelect.createEl("option", {
			value: "all",
			text: `All Dates (${totalCount})`
		});

		// Add user-defined filters with counts
		for (const filter of this.plugin.settings.filters) {
			// Calculate count for this filter
			const filteredMentions = this.applyFilterById(allMentions, filter.id);
			const count = filteredMentions.length;

			filterSelect.createEl("option", {
				value: filter.id,
				text: `${filter.name} (${count})`
			});
		}

		// Set current selection
		filterSelect.value = this.plugin.settings.activeFilterId;

		filterSelect.addEventListener("change", async (e) => {
			this.plugin.settings.activeFilterId = (e.target as HTMLSelectElement).value;
			await this.plugin.saveSettings();
			this.renderContent();
		});

		// Gear icon for settings
		const gearButton = header.createEl("button", {
			cls: "clickable-icon future-dates-settings-button",
			attr: { "aria-label": "Open Future Dates settings" }
		});
		setIcon(gearButton, "settings");

		gearButton.addEventListener("click", () => {
			// Open plugin settings using command
			(this.app as any).setting.open();
			(this.app as any).setting.openTabById(this.plugin.manifest.id);
		});

		return header;
	}

	flattenNotes(notes: FutureNotes): MentionData[] {
		const mentions: MentionData[] = [];

		for (const date in notes) {
			const files = notes[date];
			for (const sourcePath in files) {
				const contexts = files[sourcePath];
				const folderInfo = this.getFolderInfo(sourcePath);

				for (const context of contexts) {
					mentions.push({
						date,
						context,
						sourcePath,
						folderName: folderInfo.name,
						folderIcon: folderInfo.icon
					});
				}
			}
		}

		// Sort by date
		mentions.sort((a, b) => a.date.localeCompare(b.date));

		return mentions;
	}

	getFolderInfo(filePath: string): { name: string; icon: string } {
		// Extract folder from path
		const parts = filePath.split("/");

		let folderName: string;
		if (parts.length === 1) {
			// File in vault root
			folderName = "/ (root)";
		} else {
			// Get root folder (first folder in path)
			folderName = parts[0];
		}

		// Determine emoji/character based on settings
		let icon = "📁"; // Default emoji

		// Only determine icon if the feature is enabled
		if (this.plugin.settings.showFolderIcons) {
			const lowerFolderName = folderName.toLowerCase();

			// Check each icon mapping for keyword matches
			for (const mapping of this.plugin.settings.iconMappings) {
				const hasMatch = mapping.keywords.some(keyword =>
					lowerFolderName.includes(keyword.toLowerCase())
				);

				if (hasMatch) {
					icon = mapping.icon;
					break; // Use first match
				}
			}
		}

		return { name: folderName, icon };
	}

	groupByMonth(mentions: MentionData[]): Map<string, MentionData[]> {
		const groups = new Map<string, MentionData[]>();

		for (const mention of mentions) {
			const monthKey = moment(mention.date).format("MMMM YYYY");

			if (!groups.has(monthKey)) {
				groups.set(monthKey, []);
			}

			groups.get(monthKey)!.push(mention);
		}

		return groups;
	}

	renderMonthGroups(container: HTMLElement, monthGroups: Map<string, MentionData[]>) {
		if (monthGroups.size === 0) {
			const empty = container.createDiv({ cls: "future-dates-empty" });
			empty.textContent = "No future dates found";
			return;
		}

		for (const [monthName, mentions] of monthGroups) {
			// Month section wrapper (for background)
			const monthSection = container.createDiv({ cls: "future-dates-month-section" });

			// Month header
			const monthHeader = monthSection.createDiv({ cls: "future-dates-month-header" });
			monthHeader.textContent = monthName;

			// Mentions list for this month
			const mentionsList = monthSection.createDiv({ cls: "future-dates-month-content" });

			for (const mention of mentions) {
				this.renderMentionRow(mentionsList, mention);
			}
		}
	}

	cleanContextText(context: string, date: string): string {
		let cleaned = context;

		// Remove the date from context to avoid duplication
		cleaned = cleaned.replace(new RegExp(date, 'g'), '');

		// Remove empty parentheses left after date removal
		cleaned = cleaned.replace(/\(\s*\)/g, '');

		// Convert markdown links [text](url) to HTML <a> tags
		cleaned = cleaned.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="external-link" target="_blank">$1</a>');

		// Remove table cell separators
		cleaned = cleaned.replace(/\|\|/g, ' '); // Double pipes
		cleaned = cleaned.replace(/\|/g, ' '); // Single pipes

		// Remove leading bullet/list markers (but not hyphens within text)
		cleaned = cleaned.replace(/^\s*[-*+]\s+/, ''); // At start of string
		cleaned = cleaned.replace(/\s+[-*+]\s+/g, ' '); // After spaces

		// Remove task list markers
		cleaned = cleaned.replace(/\[\s*[xX\s]\s*\]/g, '');

		// Remove extra whitespace
		cleaned = cleaned.replace(/\s+/g, ' ').trim();

		// Remove leading/trailing punctuation artifacts if they're alone
		cleaned = cleaned.replace(/^[|:\-–—]\s*/, ''); // Leading separators
		cleaned = cleaned.replace(/\s*[|:\-–—]$/, ''); // Trailing separators

		return cleaned;
	}

	renderMentionRow(container: HTMLElement, mention: MentionData) {
		const row = container.createDiv({ cls: "future-dates-row" });

		// Apply compactness setting (1-5 scale)
		const compactness = this.plugin.settings.rowCompactness;
		const paddingVertical = compactness * 2; // 2px, 4px, 6px, 8px, 10px
		const paddingHorizontal = 8;
		row.style.padding = `${paddingVertical}px ${paddingHorizontal}px`;

		// Left side: date + context
		const leftSide = row.createDiv({ cls: "future-dates-left" });

		// Date (clickable)
		const dateLink = leftSide.createEl("a", {
			cls: "future-dates-date",
			text: mention.date,
			href: "#"
		});
		dateLink.addEventListener("click", (e) => {
			e.preventDefault();
			// Construct the full path using the configured daily notes path
			const dailyNotesPath = this.plugin.settings.dailyNotesPath;
			const fullPath = dailyNotesPath
				? `${dailyNotesPath}/${mention.date}`
				: mention.date;
			this.workspace.openLinkText(fullPath, "/", false);
		});

		// Context - clean up markdown artifacts
		const contextEl = leftSide.createDiv({ cls: "future-dates-context" });
		const cleanContext = this.cleanContextText(mention.context, mention.date);
		contextEl.innerHTML = cleanContext;

		// Right side: source file with optional folder icon
		const rightSide = row.createDiv({ cls: "future-dates-right" });

		const sourceLink = rightSide.createEl("a", {
			cls: "future-dates-source",
			href: "#",
			attr: { title: mention.sourcePath } // Tooltip showing full path
		});

		// Add folder icon/emoji (only if enabled in settings)
		if (this.plugin.settings.showFolderIcons) {
			sourceLink.createSpan({
				cls: "future-dates-folder-icon",
				text: mention.folderIcon
			});
		}

		// Add folder name
		sourceLink.createSpan({
			cls: "future-dates-folder-name",
			text: mention.folderName
		});

		sourceLink.addEventListener("click", (e) => {
			e.preventDefault();
			this.workspace.openLinkText(mention.sourcePath, "/", false);
		});

		row.appendChild(leftSide);
		row.appendChild(rightSide);
	}

	onModelChange() {
		this.renderContent();
	}
}
