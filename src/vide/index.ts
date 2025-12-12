// Packages
import Vide, { cleanup, effect, untrack } from "@rbxts/vide";

// Types
import type Types from "./types";

// Components
import { AppContainer } from "./container";
import { AppRegistry } from "./decorator";

// Classes
import RulesManager from "./rules";

// Helpers
import { createSource } from "./helpers";
import { RunService } from "@rbxts/services";

export default class AppForge {
	public sources = new Map<AppNames, Vide.Source<boolean>>();
	public loaded = new Map<AppNames, Vide.Node>();

	private rulesManager = new RulesManager(this);

	public getSource(name: AppNames) {
		if (!this.sources.has(name)) createSource(name, this);

		return this.sources.get(name)!;
	}

	public bind(name: AppNames, value: Vide.Source<boolean>) {
		if (!RunService.IsRunning()) {
			this.sources.set(name, value);
			effect(() => {
				value();
				untrack(() => this.rulesManager.applyRules(name));
			});
		} else warn("forge.bind is used for studio when game isnt running");
	}

	public set(name: AppNames, value: boolean, rules: boolean = true) {
		if (rules) this.rulesManager.applyRules(name);

		let src = this.sources.get(name);

		if (!src) {
			createSource(name, this);
			src = this.sources.get(name)!;
		}

		if (src() === value) return;

		src(value);
	}

	public open(name: AppNames, rules: boolean = true) {
		this.set(name, true, rules);
	}

	public close(name: AppNames, rules: boolean = true) {
		this.set(name, false, rules);
	}

	public toggle(name: AppNames, rules: boolean = true) {
		this.set(name, !this.getSource(name)(), rules);
	}

	public renderApp(props: Types.Props.Name & Types.Props.Main) {
		return AppContainer(props);
	}

	public renderApps(props: Types.Props.Name & Types.Props.Main) {
		const names = props.names;
		if (names) {
			return names.map((name) => this.renderApp({ ...props, name, names: undefined }));
		}

		throw "No app names provided to renderApps";
	}

	public renderAll(props: Types.Props.Main) {
		const names = [] as AppNames[];
		AppRegistry.forEach((_, name) => {
			names.push(name);
		});
		return this.renderApps({ ...props, names });
	}
}
