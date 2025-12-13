// Services
import { RunService } from "@rbxts/services";

// Packages
import Vide, { effect, mount, untrack } from "@rbxts/vide";

// Types
import type Types from "./types";

// Components
import { AppContainer } from "./container";
import { AppRegistry } from "./decorator";

// Classes
import RulesManager from "./rules";

// Helpers
import {
	createSource,
	renderNames,
	collectByGroup,
	normalizeGroups,
	Render,
	type RenderAPI,
} from "./helpers";

export default class AppForge {
	public sources = new Map<AppNames, Vide.Source<boolean>>();
	public loaded = new Map<AppNames, Vide.Node>();
	public innerMount!: () => void;

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

	public mount(callback: (Render: RenderAPI) => Vide.Node, target: Instance) {
		this.innerMount = mount(() => callback(Render), target);
	}
	public unMount() {
		this.innerMount();
	}

	public toggle(name: AppNames, rules: boolean = true) {
		this.set(name, !this.getSource(name)(), rules);
	}

	public renderApp(props: Types.Props.Main) {
		return AppContainer(props);
	}
	public renderApps(props: Types.Props.Main) {
		const names = props.render?.names;
		if (!names) throw "No app names provided to renderApps";

		return renderNames(props, names, this);
	}
	public renderGroup(props: Types.Props.Main) {
		const group = props.render?.group;
		if (!group) throw "No app names provided to renderApps";

		const groups = normalizeGroups(group);
		return renderNames(props, collectByGroup(groups), this);
	}
	public renderGroupByName(props: Types.Props.Main) {
		const { group, name } = props.render ?? {};
		if (!group || !name) throw "No app names provided to renderApps";

		const groups = normalizeGroups(group);
		return renderNames(
			props,
			collectByGroup(groups, (n) => n === name),
			this,
		);
	}
	public renderGroupByNames(props: Types.Props.Main) {
		const { group, names } = props.render ?? {};
		if (!group || !names) throw "No app names provided to renderApps";

		const groups = normalizeGroups(group);
		return renderNames(
			props,
			collectByGroup(groups, (n) => names.includes(n)),
			this,
		);
	}
	public renderAll(props: Types.Props.Main) {
		const names: AppNames[] = [];
		AppRegistry.forEach((_, name) => names.push(name));

		return renderNames(props, names, this);
	}
}
