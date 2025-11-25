// Packages
import React from "@rbxts/react";

// Types
import type Types from "./types";

// Components
import { AppRegistry, Args, App } from "./decorator";
import { AppContainer } from "./container";

// Classes
import RulesManager from "./rules";

export default class AppForge {
	public binds = new Map<AppNames[number], [React.Binding<boolean>, (T: boolean) => void]>();
	public loaded = new Map<AppNames[number], React.Element>();

	private rulesManager = new RulesManager(this);

	public getBind(name: AppNames[number]) {
		if (!this.binds.has(name)) error(`App "${name}" has no binding`);
		return this.binds.get(name)![0];
	}

	public getState(name: AppNames[number]) {
		return this.getBind(name).getValue();
	}

	public set(name: AppNames[number], value: boolean) {
		if (!this.rulesManager.applyRules(name, value)) return;
		const [_, setBinding] = this.binds.get(name)!;

		if (!setBinding) error(`App "${name}" has no binding setter`);

		setBinding(value);
	}

	public open(name: AppNames[number]) {
		this.set(name, true);
	}

	public close(name: AppNames[number]) {
		this.set(name, false);
	}

	public toggle(name: AppNames[number]) {
		this.set(name, !this.getState(name));
	}

	public renderApp(props: Types.MainProps) {
		return <AppContainer {...props} />;
	}

	public renderApps(props: Types.MainProps) {
		const { name, names } = props;

		if (name) {
			return this.renderApp({ props, name, forge: this });
		} else if (names) {
			return names.map((n) => this.renderApp({ props, name: n, forge: this }));
		}

		throw "Invalid props: must provide name or names";
	}

	public renderAll(props: Types.MainProps) {
		const names = [] as AppNames[number][];
		AppRegistry.forEach((_, name) => {
			names.push(name);
		});
		return this.renderApps({ props, names, forge: this });
	}
}

export { App, Args };
export { Render } from "./helpers";

export type { MainProps } from "./types";
