// Packages
import Object from "@rbxts/object-utils";
import React from "@rbxts/react";

// Components
import { AppRegistry, Args, App } from "./decorator";
import { AppContainer } from "./container";

// Classes
import RulesManager from "./rules";

export default class AppForge {
	public binds = new Map<AppNames[number], [React.Binding<boolean>, (T: boolean) => void]>();
	public loaded = new Map<AppNames[number], React.Element>();

	private rulesManager = new RulesManager(this);

	private getAllNames(): AppNames[number][] {
		return Object.keys(AppRegistry) as AppNames[number][];
	}

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

	public renderApp(props: AppProps, name: AppNames[number]) {
		return <AppContainer key={`${name}_Container`} name={name} manager={this} {...props} />;
	}

	public renderApps(props: AppProps, names: AppNames[number][]) {
		return names.map((n) => this.renderApp(props, n));
	}

	public renderAll(props: AppProps) {
		return this.renderApps(props, this.getAllNames());
	}
}

export { App, Args };
export { Render } from "./helpers";
