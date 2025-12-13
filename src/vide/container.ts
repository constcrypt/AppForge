// Services
import { RunService } from "@rbxts/services";

// Packages
import vide, { source } from "@rbxts/vide";

// Types
import type Types from "./types";

// Components
import { AppRegistry } from "./decorator";
import { renderHook } from "@rbxts/loners-pretty-react-hooks";

const create = vide.create;

function createInstance(props: Types.Props.Main) {
	const { forge, render } = props;

	const name = render?.name;
	if (!name) throw "App name is required to create instance";

	const appClass = AppRegistry.get(name);
	if (!appClass) throw `App "${name}" not registered`;

	if (!forge.loaded.has(name)) {
		const instance = new appClass.constructor(props, name);
		forge.loaded.set(name, instance.render());
	}

	return forge.loaded.get(name)!;
}

export function AppContainer(props: Types.Props.Main) {
	const { render } = props;

	const name = render?.name;
	if (!name) throw "App name is required in AppContainer";

	const element = createInstance(props);
	if (!element) error(`Failed to create instance for app "${name}"`);

	if (RunService.IsRunning()) {
		return create("ScreenGui")({
			Name: name,
			ZIndexBehavior: "Sibling",
			ResetOnSpawn: false,

			[0]: element,
		});
	} else {
		return create("Frame")({
			Name: name,
			BackgroundTransparency: 1,
			Size: UDim2.fromScale(1, 1),

			[0]: element,
		});
	}
}
