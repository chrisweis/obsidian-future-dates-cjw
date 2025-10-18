import { Plugin } from "obsidian";
import Model from "./model";
import FutureDatesView from "./view";
import { FutureDatesSettings, DEFAULT_SETTINGS, FutureDatesSettingTab } from "./settings";

class ObsidianFutureDatesPlugin extends Plugin {
	model: Model;
	settings: FutureDatesSettings;

	async onload() {
		await this.loadSettings();

		this.model = new Model(this, this.settings);

		this.registerView(
			FutureDatesView.TYPE,
			(leaf) => new FutureDatesView(leaf, this.model, this.app.workspace)
		);

		this.addSettingTab(new FutureDatesSettingTab(this.app, this));

		this.app.workspace.onLayoutReady(() => {
			this.initLeaf();
		});
	}

	async onunload() {
		this.model.finish();
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	initLeaf(): void {
		if (this.app.workspace.getLeavesOfType(FutureDatesView.TYPE).length) {
			return;
		}
		const rightLeaf = this.app.workspace.getRightLeaf(false);
		if (rightLeaf) {
			rightLeaf.setViewState({
				type: FutureDatesView.TYPE,
			});
		}
	}
}

export default ObsidianFutureDatesPlugin;
module.exports = ObsidianFutureDatesPlugin;
