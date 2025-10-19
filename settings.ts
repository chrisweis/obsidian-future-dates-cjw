import { App, PluginSettingTab, Setting, TFolder } from "obsidian";
import type ObsidianFutureDatesPlugin from "./main";

export interface DateFilter {
	id: string;
	name: string;
	includeFolders: string[]; // Whitelist - if not empty, only show these
	excludeFolders: string[]; // Blacklist - hide these
}

export interface IconKeywordMapping {
	icon: string; // Emoji or character (up to 3 chars) to display
	keywords: string[]; // Keywords to match in folder names
}

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
	rowCompactness: number; // 1 = very compact, 5 = very spacious
	showFolderIcons: boolean;
	iconMappings: IconKeywordMapping[];

	// Filters
	filters: DateFilter[];
	activeFilterId: string; // "all" or filter ID
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
	showPastDates: false,
	rowCompactness: 2, // Default to compact (current setting)
	showFolderIcons: false, // Disabled by default since user has own icons
	iconMappings: [
		{ icon: "💼", keywords: ["work", "project"] },
		{ icon: "🏠", keywords: ["personal", "home"] },
		{ icon: "📖", keywords: ["journal", "daily"] }
	],

	// Filter defaults
	filters: [],
	activeFilterId: "all"
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
					this.display(); // Refresh to show/hide keywords input
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

			// Excluded folders section with integrated search
			const excludedSetting = new Setting(containerEl)
				.setName("Excluded folders")
				.setDesc("Search for folders to add. Click folder names in the list below to remove them.");

			// Container for search and list
			const excludedContainer = containerEl.createDiv({ cls: "future-dates-excluded-container" });
			excludedContainer.style.marginBottom = "16px";

			// Search input
			const searchInput = excludedContainer.createEl("input", {
				type: "text",
				placeholder: "Type to search folders...",
				cls: "future-dates-folder-search"
			});
			searchInput.style.width = "100%";
			searchInput.style.padding = "6px 12px";
			searchInput.style.marginBottom = "8px";
			searchInput.style.border = "1px solid var(--background-modifier-border)";
			searchInput.style.borderRadius = "4px";

			// Search results
			const resultsContainer = excludedContainer.createDiv({ cls: "future-dates-search-results" });
			resultsContainer.style.maxHeight = "120px";
			resultsContainer.style.overflowY = "auto";
			resultsContainer.style.border = "1px solid var(--background-modifier-border)";
			resultsContainer.style.borderRadius = "4px";
			resultsContainer.style.marginBottom = "8px";
			resultsContainer.style.display = "none"; // Hidden until search

			const renderSearchResults = (query: string) => {
				resultsContainer.empty();

				if (query.trim().length === 0) {
					resultsContainer.style.display = "none";
					return;
				}

				resultsContainer.style.display = "block";

				// Filter out already excluded folders and search
				const filteredFolders = allFolders.filter(f =>
					!this.plugin.settings.excludedFolders.includes(f) &&
					f.toLowerCase().includes(query.toLowerCase())
				);

				if (filteredFolders.length === 0) {
					const noResults = resultsContainer.createDiv();
					noResults.style.padding = "8px";
					noResults.style.color = "var(--text-muted)";
					noResults.textContent = "No folders found";
					return;
				}

				// Show max 8 results
				filteredFolders.slice(0, 8).forEach(folder => {
					const resultItem = resultsContainer.createDiv();
					resultItem.style.padding = "6px 12px";
					resultItem.style.cursor = "pointer";
					resultItem.style.borderBottom = "1px solid var(--background-modifier-border)";

					resultItem.addEventListener("mouseenter", () => {
						resultItem.style.backgroundColor = "var(--background-modifier-hover)";
					});

					resultItem.addEventListener("mouseleave", () => {
						resultItem.style.backgroundColor = "";
					});

					resultItem.textContent = folder;

					resultItem.addEventListener("click", async () => {
						// Add to excluded list
						this.plugin.settings.excludedFolders.push(folder);
						await this.plugin.saveSettings();
						this.plugin.model.collectNotes();
						searchInput.value = ""; // Clear search
						renderSearchResults(""); // Hide results
						renderExcludedList(); // Update list
					});
				});

				if (filteredFolders.length > 8) {
					const moreInfo = resultsContainer.createDiv();
					moreInfo.style.padding = "6px 12px";
					moreInfo.style.color = "var(--text-muted)";
					moreInfo.style.fontSize = "0.85em";
					moreInfo.textContent = `Showing 8 of ${filteredFolders.length} results. Refine search to see more.`;
				}
			};

			searchInput.addEventListener("input", (e) => {
				renderSearchResults((e.target as HTMLInputElement).value);
			});

			// Excluded folders list
			const excludedListContainer = excludedContainer.createDiv({ cls: "future-dates-excluded-list" });
			excludedListContainer.style.border = "1px solid var(--background-modifier-border)";
			excludedListContainer.style.borderRadius = "4px";
			excludedListContainer.style.padding = "8px";
			excludedListContainer.style.maxHeight = "200px";
			excludedListContainer.style.overflowY = "auto";

			const renderExcludedList = () => {
				excludedListContainer.empty();

				if (this.plugin.settings.excludedFolders.length === 0) {
					const emptyMsg = excludedListContainer.createDiv();
					emptyMsg.style.padding = "8px";
					emptyMsg.style.color = "var(--text-muted)";
					emptyMsg.textContent = "No folders excluded. Use search above to add folders.";
					return;
				}

				this.plugin.settings.excludedFolders.forEach(folder => {
					const folderItem = excludedListContainer.createDiv();
					folderItem.style.padding = "6px 12px";
					folderItem.style.cursor = "pointer";
					folderItem.style.borderBottom = "1px solid var(--background-modifier-border)";
					folderItem.style.display = "flex";
					folderItem.style.justifyContent = "space-between";
					folderItem.style.alignItems = "center";

					folderItem.addEventListener("mouseenter", () => {
						folderItem.style.backgroundColor = "var(--background-modifier-hover)";
					});

					folderItem.addEventListener("mouseleave", () => {
						folderItem.style.backgroundColor = "";
					});

					const folderName = folderItem.createSpan({ text: folder });
					folderName.style.flex = "1";

					const removeHint = folderItem.createSpan({ text: "Click to remove" });
					removeHint.style.fontSize = "0.85em";
					removeHint.style.color = "var(--text-muted)";

					folderItem.addEventListener("click", async () => {
						// Remove from excluded list
						this.plugin.settings.excludedFolders =
							this.plugin.settings.excludedFolders.filter(f => f !== folder);
						await this.plugin.saveSettings();
						this.plugin.model.collectNotes();
						renderExcludedList(); // Update list
					});
				});
			};

			renderExcludedList();
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

		// Row compactness
		new Setting(containerEl)
			.setName("Row spacing")
			.setDesc("Control how compact or spacious the date rows appear. Lower values show more items in the view.")
			.addSlider(slider => slider
				.setLimits(1, 5, 1)
				.setValue(this.plugin.settings.rowCompactness)
				.setDynamicTooltip()
				.onChange(async (value) => {
					this.plugin.settings.rowCompactness = value;
					await this.plugin.saveSettings();
					// Trigger view refresh without re-collecting notes
					this.plugin.model.dispatchEvent(new Event("change"));
				})
			);

		// Show folder icons
		new Setting(containerEl)
			.setName("Show folder icons")
			.setDesc("Display smart icons next to folder names based on keyword detection. Disable if you already have icons in your folder names.")
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.showFolderIcons)
				.onChange(async (value) => {
					this.plugin.settings.showFolderIcons = value;
					await this.plugin.saveSettings();
					this.plugin.model.dispatchEvent(new Event("change"));
					this.display(); // Refresh to show/hide icon mappings
				})
			);

		// Icon keyword mappings (only show if icons enabled)
		if (this.plugin.settings.showFolderIcons) {
			containerEl.createEl("h4", { text: "Icon Keyword Mappings", cls: "setting-item-heading" });

			containerEl.createEl("p", {
				text: "Configure which emoji or character appears based on keywords in folder names. Use any emoji (💼, 🏠, 📖) or character (up to 3 chars).",
				cls: "setting-item-description"
			});

			this.plugin.settings.iconMappings.forEach((mapping, index) => {
				const mappingContainer = containerEl.createDiv({ cls: "future-dates-icon-mapping" });
				mappingContainer.style.marginBottom = "8px";
				mappingContainer.style.padding = "8px";
				mappingContainer.style.border = "1px solid var(--background-modifier-border)";
				mappingContainer.style.borderRadius = "4px";

				new Setting(mappingContainer)
					.setName(`${mapping.icon || "📁"} Mapping ${index + 1}`)
					.setDesc("Character/Emoji")
					.addText(text => {
						text
							.setPlaceholder("💼")
							.setValue(mapping.icon)
							.onChange(async (value) => {
								// Limit to 3 characters
								mapping.icon = value.slice(0, 3);
								text.setValue(mapping.icon);
								await this.plugin.saveSettings();
								this.plugin.model.dispatchEvent(new Event("change"));
								this.display(); // Refresh to show new icon in heading
							});
						text.inputEl.style.width = "60px";
						text.inputEl.style.textAlign = "center";
						text.inputEl.style.fontSize = "1.2em";
					})
					.addText(text => {
						text
							.setPlaceholder("Keywords: work, project")
							.setValue(mapping.keywords.join(", "))
							.onChange(async (value) => {
								mapping.keywords = value
									.split(",")
									.map(k => k.trim())
									.filter(k => k.length > 0);
								await this.plugin.saveSettings();
								this.plugin.model.dispatchEvent(new Event("change"));
							});
						text.inputEl.style.flex = "1";
					})
					.addButton(button => button
						.setButtonText("Remove")
						.setWarning()
						.onClick(async () => {
							this.plugin.settings.iconMappings.splice(index, 1);
							await this.plugin.saveSettings();
							this.plugin.model.dispatchEvent(new Event("change"));
							this.display();
						})
					);
			});

			// Add new mapping button
			new Setting(containerEl)
				.setName("Add icon mapping")
				.addButton(button => button
					.setButtonText("Add Mapping")
					.onClick(async () => {
						this.plugin.settings.iconMappings.push({
							icon: "📁",
							keywords: []
						});
						await this.plugin.saveSettings();
						this.display();
					})
				);
		}

		// ============ FILTERS ============
		containerEl.createEl("h3", { text: "View Filters" });

		containerEl.createEl("p", {
			text: "Create named filters to quickly show dates from specific folders. Use the dropdown in the Future Dates view to switch between filters.",
			cls: "setting-item-description"
		});

		// Create new filter button
		new Setting(containerEl)
			.setName("Create new filter")
			.setDesc("Add a custom filter to organize your future dates by folder.")
			.addButton(button => button
				.setButtonText("New Filter")
				.onClick(async () => {
					const newFilter: DateFilter = {
						id: `filter-${Date.now()}`,
						name: `Filter ${this.plugin.settings.filters.length + 1}`,
						includeFolders: [],
						excludeFolders: []
					};
					this.plugin.settings.filters.push(newFilter);
					await this.plugin.saveSettings();
					this.display(); // Refresh to show new filter
				})
			);

		// Display existing filters
		if (this.plugin.settings.filters.length > 0) {
			containerEl.createEl("h4", { text: "Manage Filters" });

			for (const filter of this.plugin.settings.filters) {
				this.renderFilterSettings(containerEl, filter);
			}
		}

		// ============ INFO ============
		containerEl.createEl("h3", { text: "About" });

		const infoDiv = containerEl.createDiv();
		infoDiv.innerHTML = `
			<p>
				<strong>Future Dates CJW v1.6.0</strong><br>
				Fork maintained by Chris Weis<br>
				Original by Dmitry Manannikov
			</p>
			<p>
				<a href="https://github.com/chrisweis/obsidian-future-dates-cjw">GitHub</a> |
				<a href="https://github.com/chrisweis/obsidian-future-dates-cjw/issues">Report Issues</a>
			</p>
		`;
	}

	renderFilterSettings(containerEl: HTMLElement, filter: DateFilter): void {
		const filterSection = containerEl.createDiv({ cls: "future-dates-filter-section" });
		filterSection.style.border = "1px solid var(--background-modifier-border)";
		filterSection.style.borderRadius = "4px";
		filterSection.style.padding = "12px";
		filterSection.style.marginBottom = "12px";

		// Filter name and delete button
		new Setting(filterSection)
			.setName("Filter name")
			.setDesc(`ID: ${filter.id}`)
			.addText(text => text
				.setPlaceholder("My Filter")
				.setValue(filter.name)
				.onChange(async (value) => {
					filter.name = value;
					await this.plugin.saveSettings();
					// Trigger view refresh
					this.plugin.model.dispatchEvent(new Event("change"));
				})
			)
			.addButton(button => button
				.setButtonText("Delete")
				.setWarning()
				.onClick(async () => {
					this.plugin.settings.filters = this.plugin.settings.filters.filter(f => f.id !== filter.id);
					// If this was the active filter, reset to "all"
					if (this.plugin.settings.activeFilterId === filter.id) {
						this.plugin.settings.activeFilterId = "all";
					}
					await this.plugin.saveSettings();
					this.plugin.model.dispatchEvent(new Event("change"));
					this.display(); // Refresh to remove deleted filter
				})
			);

		// Include folders
		new Setting(filterSection)
			.setName("Include folders")
			.setDesc("Only show dates from these folders (leave empty to show all folders).")
			.addTextArea(text => {
				text
					.setPlaceholder("Work/Projects\nPersonal")
					.setValue(filter.includeFolders.join("\n"))
					.onChange(async (value) => {
						filter.includeFolders = value
							.split("\n")
							.map(f => f.trim())
							.filter(f => f.length > 0);
						await this.plugin.saveSettings();
						this.plugin.model.dispatchEvent(new Event("change"));
					});
				text.inputEl.rows = 3;
				text.inputEl.cols = 50;
			});

		// Exclude folders
		new Setting(filterSection)
			.setName("Exclude folders")
			.setDesc("Hide dates from these folders.")
			.addTextArea(text => {
				text
					.setPlaceholder("Archive\nTemplates")
					.setValue(filter.excludeFolders.join("\n"))
					.onChange(async (value) => {
						filter.excludeFolders = value
							.split("\n")
							.map(f => f.trim())
							.filter(f => f.length > 0);
						await this.plugin.saveSettings();
						this.plugin.model.dispatchEvent(new Event("change"));
					});
				text.inputEl.rows = 3;
				text.inputEl.cols = 50;
			});
	}
}
