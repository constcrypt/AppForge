// Packages
import React, { ReactPureComponent } from "@rbxts/react";

// Types
import type Types from "./types";

// Components
import { AppRegistry, Args, App } from "./decorator";
import { AppContainer } from "./container";

// Classes
import RulesManager from "./rules";
import { RunService } from "@rbxts/services";

export default class AppForge {
	public binds = new Map<AppNames[number], [React.Binding<boolean>, (T: boolean) => void]>();
	public loaded = new Map<AppNames[number], React.Element>();

	private rulesManager = new RulesManager(this);

	public getBind(name: AppNames[number]) {
		if (!RunService.IsRunning()) return; // THIS IS FOR UILABS for when rendering less then the entire App

		if (!this.binds.has(name)) throw `App "${name}" has no binding`;
		return this.binds.get(name)![0];
	}

	public getState(name: AppNames[number]) {
		return this.getBind(name)?.getValue();
	}

	public set(name: AppNames[number], value: boolean) {
		if (!this.rulesManager.applyRules(name, value)) return;
		const [_, setBinding] = this.binds.get(name)!;

		if (!setBinding) throw `App "${name}" has no binding setter`;

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

	public renderApp(props: Types.NameProps & Types.MainProps) {
		return <AppContainer {...props} />;
	}

	public renderApps(props: Types.NameProps & Types.MainProps) {
		const names = props.names;
		if (names) {
			return names.map((name) => this.renderApp({ ...props, name, names: undefined }));
		}

		throw "No app names provided to renderApps";
	}

	public renderAll(props: Types.MainProps) {
		const names = [] as AppNames[number][];
		AppRegistry.forEach((_, name) => {
			names.push(name);
		});
		return this.renderApps({ ...props, names });
	}
}

export { App, Args };
export { Render } from "./helpers";

export type { MainProps, NameProps, Props } from "./types";
