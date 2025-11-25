// Services
import { RunService } from "@rbxts/services";

// Packages
import { useBindingListener, useSpring } from "@rbxts/loners-pretty-react-hooks";
import React, { cloneElement, useBinding, useState } from "@rbxts/react";

// Types
import type AppForge from ".";

// Components
import { AppRegistry } from "./decorator";

function createBinding(name: AppNames[number], manager: AppForge) {
	const app = AppRegistry.get(name);
	if (!app) error(`App "${name}" not registered`);

	const binding = useBinding(app.visible ?? false);
	manager.binds.set(name, binding);
	return binding;
}
function createInstance(props: AppProps, name: AppNames[number], manager: AppForge) {
	const appClass = AppRegistry.get(name);
	if (!appClass) error(`App "${name}" not registered`);

	if (!manager.loaded.has(name)) {
		const instance = new appClass.constructor(props);
		const element = cloneElement(instance.render(), { key: "Main" });

		manager.loaded.set(name, element);
	}
	return manager.loaded.get(name)!;
}

export function AppContainer(props: AppProps & { name: AppNames[number]; manager: AppForge }) {
	const { name, manager } = props;

	const [binding, _] = createBinding(name, manager);

	const spring = useSpring(
		binding.map((v) => (v ? 0 : 1)),
		{ frequency: 0.4, damping: 0.8 },
	);

	const [_isVisible, setisVisible] = useState(binding.getValue());

	const element = createInstance(props, name, manager);
	if (!element) error(`Failed to create instance for app "${name}"`);

	useBindingListener(spring, (v) => {
		setisVisible(v === 0);
	});

	if (RunService.IsRunning()) {
		return (
			<screengui key={name} ZIndexBehavior="Sibling" ResetOnSpawn={false}>
				{element}
			</screengui>
		);
	} else {
		return (
			<frame key={name} BackgroundTransparency={1} Size={UDim2.fromScale(1, 1)}>
				{element}
			</frame>
		);
	}
}
