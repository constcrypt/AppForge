// Packages
import React from "@rbxts/react";

// Types
import type Types from "./types";

export const AppRegistry = new Map<string, Types.AppRegistry>();

export function App(props: Types.AppRegistryProps) {
	return function <T extends new (props: AppProps) => Args>(constructor: T) {
		if (AppRegistry.has(props.name)) {
			error(`Duplicate registered App name "${props.name}"`);
		}

		AppRegistry.set(props.name, {
			constructor,
			visible: props.visible,
			rules: props.rules,
		});

		return constructor;
	};
}

export abstract class Args {
	public readonly props: AppProps;

	constructor(props: AppProps) {
		this.props = props;
	}

	abstract render(): React.Element;
}
