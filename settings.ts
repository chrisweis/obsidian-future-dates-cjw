import { App, PluginSettingTab, Setting, TFolder } from "obsidian";
import type ObsidianFutureDatesPlugin from "./main";

export interface FutureDatesSettings {
	// Exclusion options
	excludeDatesWithDisplayText: boolean;
	excludeNavigationKeywords: boolean;
	navigationKeywords: string[];
	excludeCustomPatterns: boolean;
	customPatterns: string[];
	excludeFolders: boolean;
	excludedFolders: string[];

	// Display options
	contextLength: number;
	showPastDates: boolean;
}

export const DEFAULT_SETTINGS: FutureDatesSettings = {
	// Exclusion defaults
	excludeDatesWithDisplayText: true,
	excludeNavigationKeywords: true,
	navigationKeywords: [
		"Previous Day",
		"Next Day",
		"Week",
		"Month",
		"Quarter",
		"Year"
	],
	excludeCustomPatterns: false,
	customPatterns: [],
	excludeFolders: false,
	excludedFolders: [],

	// Display defaults
	contextLength: 50,
	showPastDates: false
};

export class FutureDatesSettingTab extends PluginSettingTab {
	plugin: ObsidianFutureDatesPlugin;

	constructor(app: App, plugin: ObsidianFutureDatesPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl("h2", { text: "Future Dates CJW Settings" });

		// ============ EXCLUSION SETTINGS ============
		containerEl.createEl("h3", { text: "Date Exclusion" });

		containerEl.createEl("p", {
			text: "Control which date links are excluded from the Future Dates view.",
			cls: "setting-item-description"
		});

		// Exclude dates with display text
		new Setting(containerEl)
			.setName("Exclude dates with display text")
			.setDesc("Exclude date links that have custom display text (e.g., [[2025-10-19|Next Day ▶]]). Common in navigation templates.")
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.excludeDatesWithDisplayText)
				.onChange(async (value) => {
					this.plugin.settings.excludeDatesWithDisplayText = value;
					await this.plugin.saveSettings();
					this.plugin.model.collectNotes();
				})
			);

		// Exclude navigation keywords
		new Setting(containerEl)
			.setName("Exclude navigation links")
			.setDesc("Exclude dates found in lines containing navigation keywords (Previous Day, Next Day, Week, etc.).")
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.excludeNavigationKeywords)
				.onChange(async (value) => {
					this.plugin.settings.excludeNavigationKeywords = value;
					await this.plugin.saveSettings();
					this.plugin.model.collectNotes();
				})
			);

		// Navigation keywords list
		if (this.plugin.settings.excludeNavigationKeywords) {
			new Setting(containerEl)
				.setName("Navigation keywords")
				.setDesc("Comma-separated list of keywords to identify navigation links.")
				.addTextArea(text => text
					.setPlaceholder("Previous Day, Next Day, Week, Month")
					.setValue(this.plugin.settings.navigationKeywords.join(", "))
					.onChange(async (value) => {
						this.plugin.settings.navigationKeywords = value
							.split(",")
							.map(k => k.trim())
							.filter(k => k.length > 0);
						await this.plugin.saveSettings();
						this.plugin.model.collectNotes();
					})
				);
		}

		// Custom patterns
		new Setting(containerEl)
			.setName("Enable custom exclusion patterns")
			.setDesc("Exclude dates from lines matching custom regex patterns (advanced).")
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.excludeCustomPatterns)
				.onChange(async (value) => {
					this.plugin.settings.excludeCustomPatterns = value;
					await this.plugin.saveSettings();
					this.plugin.model.collectNotes();
					this.display(); // Refresh to show/hide pattern input
				})
			);

		if (this.plugin.settings.excludeCustomPatterns) {
			new Setting(containerEl)
				.setName("Custom exclusion patterns")
				.setDesc("Enter regex patterns (one per line) to exclude matching lines. Example: ^\\[\\[.*\\|.*Day.*\\]\\]")
				.addTextArea(text => {
					text
						.setPlaceholder("^\\[\\[.*\\|.*Day.*\\]\\]\n^.*Navigation.*$")
						.setValue(this.plugin.settings.customPatterns.join("\n"))
						.onChange(async (value) => {
							this.plugin.settings.customPatterns = value
								.split("\n")
								.map(p => p.trim())
								.filter(p => p.length > 0);
							await this.plugin.saveSettings();
							this.plugin.model.collectNotes();
						});
					text.inputEl.rows = 4;
					text.inputEl.cols = 50;
				});
		}

		// Exclude folders
		new Setting(containerEl)
			.setName("Exclude specific folders")
			.setDesc("Exclude all dates found in files within specific folders (e.g., monthly/weekly planning folders).")
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.excludeFolders)
				.onChange(async (value) => {
					this.plugin.settings.excludeFolders = value;
					await this.plugin.saveSettings();
					this.plugin.model.collectNotes();
					this.display(); // Refresh to show/hide folder input
				})
			);

		if (this.plugin.settings.excludeFolders) {
			// Get all folders from vault
			const allFolders = this.app.vault.getAllLoadedFiles()
				.filter(file => file instanceof TFolder)
				.map(folder => folder.path)
				.sort();

			new Setting(containerEl)
				.setName("Excluded folders")
				.setDesc("Enter folder paths (one per line). Dates from files in these folders will not appear in Future Dates view.")
				.addTextArea(text => {
					text
						.setPlaceholder("📝 Journal/Months\n📝 Journal/Weeks\n📝 Journal/Quarters")
						.setValue(this.plugin.settings.excludedFolders.join("\n"))
						.onChange(async (value) => {
							this.plugin.settings.excludedFolders = value
								.split("\n")
								.map(f => f.trim())
								.filter(f => f.length > 0);
							await this.plugin.saveSettings();
							this.plugin.model.collectNotes();
						});
					text.inputEl.rows = 4;
					text.inputEl.cols = 50;
				});

			// Add helper: Show available folders
			const folderListSetting = new Setting(containerEl)
				.setName("Available folders")
				.setDesc(`Click folder names below to add them to the exclusion list. Found ${allFolders.length} folders in vault.`);

			if (allFolders.length > 0) {
				const folderContainer = containerEl.createDiv({ cls: "future-dates-folder-list" });
				folderContainer.style.maxHeight = "200px";
				folderContainer.style.overflowY = "auto";
				folderContainer.style.border = "1px solid var(--background-modifier-border)";
				folderContainer.style.borderRadius = "4px";
				folderContainer.style.padding = "8px";
				folderContainer.style.marginTop = "8px";

				// Add search input
				const searchInput = folderContainer.createEl("input", {
					type: "text",
					placeholder: "Search folders...",
					cls: "future-dates-folder-search"
				});
				searchInput.style.width = "100%";
				searchInput.style.marginBottom = "8px";
				searchInput.style.padding = "4px 8px";

				const folderListEl = folderContainer.createDiv();

				const renderFolders = (filter: string = "") => {
					folderListEl.empty();
					const filteredFolders = filter
						? allFolders.filter(f => f.toLowerCase().includes(filter.toLowerCase()))
						: allFolders;

					if (filteredFolders.length === 0) {
						folderListEl.createEl("div", {
							text: "No folders match your search",
							cls: "setting-item-description"
						});
						return;
					}

					filteredFolders.forEach(folder => {
						const isExcluded = this.plugin.settings.excludedFolders.includes(folder);
						const folderItem = folderListEl.createDiv({ cls: "future-dates-folder-item" });
						folderItem.style.padding = "4px 8px";
						folderItem.style.cursor = "pointer";
						folderItem.style.borderRadius = "3px";
						folderItem.style.marginBottom = "2px";
						folderItem.style.display = "flex";
						folderItem.style.justifyContent = "space-between";
						folderItem.style.alignItems = "center";

						if (isExcluded) {
							folderItem.style.backgroundColor = "var(--background-modifier-success)";
							folderItem.style.opacity = "0.6";
						}

						folderItem.addEventListener("mouseenter", () => {
							if (!isExcluded) {
								folderItem.style.backgroundColor = "var(--background-modifier-hover)";
							}
						});

						folderItem.addEventListener("mouseleave", () => {
							if (!isExcluded) {
								folderItem.style.backgroundColor = "";
							}
						});

						const folderText = folderItem.createSpan({ text: folder });

						const statusText = folderItem.createSpan({
							text: isExcluded ? "✓ Excluded" : "Click to exclude",
							cls: "setting-item-description"
						});
						statusText.style.fontSize = "0.9em";

						folderItem.addEventListener("click", async () => {
							if (isExcluded) {
								// Remove from exclusion list
								this.plugin.settings.excludedFolders =
									this.plugin.settings.excludedFolders.filter(f => f !== folder);
							} else {
								// Add to exclusion list
								this.plugin.settings.excludedFolders.push(folder);
							}
							await this.plugin.saveSettings();
							this.plugin.model.collectNotes();
							this.display(); // Refresh entire settings view
						});
					});
				};

				searchInput.addEventListener("input", (e) => {
					renderFolders((e.target as HTMLInputElement).value);
				});

				renderFolders();
			}
		}

		// ============ DISPLAY SETTINGS ============
		containerEl.createEl("h3", { text: "Display Options" });

		// Context length
		new Setting(containerEl)
			.setName("Context length")
			.setDesc("Number of characters to show before and after each date mention.")
			.addSlider(slider => slider
				.setLimits(10, 200, 10)
				.setValue(this.plugin.settings.contextLength)
				.setDynamicTooltip()
				.onChange(async (value) => {
					this.plugin.settings.contextLength = value;
					await this.plugin.saveSettings();
					this.plugin.model.collectNotes();
				})
			);

		// Show past dates
		new Setting(containerEl)
			.setName("Show past dates")
			.setDesc("Include dates in the past (not just future dates).")
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.showPastDates)
				.onChange(async (value) => {
					this.plugin.settings.showPastDates = value;
					await this.plugin.saveSettings();
					this.plugin.model.collectNotes();
				})
			);

		// ============ INFO ============
		containerEl.createEl("h3", { text: "About" });

		const infoDiv = containerEl.createDiv();
		infoDiv.innerHTML = `
			<p>
				<strong>Future Dates CJW v1.4.0</strong><br>
				Fork maintained by Chris Weis<br>
				Original by Dmitry Manannikov
			</p>
			<p>
				<a href="https://github.com/chrisweis/obsidian-future-dates-cjw">GitHub</a> |
				<a href="https://github.com/chrisweis/obsidian-future-dates-cjw/issues">Report Issues</a>
			</p>
		`;
	}
}
