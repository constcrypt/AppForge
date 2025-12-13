// Packages
import { usePx } from "@rbxts/loners-pretty-vide-utils";
import Vide, { source } from "@rbxts/vide";

// Types
import type Types from "./types";
import type AppForge from ".";

// Components
import { AppRegistry } from "./decorator";

let __px: boolean = false;

export function createSource(name: AppNames, forge: AppForge) {
	const app = AppRegistry.get(name);
	if (!app) throw `App "${name}" not registered`;

	if (forge.sources.has(name)) return;

	forge.sources.set(name, source(app.visible ?? false));
	return source;
}

export function normalizeGroups(group: GroupNames | GroupNames[]): GroupNames[] {
	return typeIs(group, "table") ? [...group] : [group];
}

export function collectByGroup(
	groups: GroupNames[],
	filter?: (name: AppNames) => boolean,
): AppNames[] {
	const result: AppNames[] = [];

	AppRegistry.forEach((app, name) => {
		const appGroup = app.renderGroup;
		if (!appGroup) return;
		if (!groups.includes(appGroup)) return;
		if (filter && !filter(name)) return;

		result.push(name);
	});

	return result;
}

export function renderNames(props: Types.Props.Main, names: AppNames[], forge: AppForge) {
	if (names.size() === 0) {
		throw "No app names provided to renderApps";
	}

	return names.map((name) =>
		forge.renderApp({
			...props,
			render: { name },
		}),
	);
}

export function Render(props: Types.Props.Main): Vide.Node {
	const { config, render, forge } = props;

	AppRegistry.forEach((_, name) => createSource(name, forge));

	if (!__px) {
		usePx(config?.px.target, config?.px.resolution, config?.px.minScale);
		__px = true;
	} else warn("Rendering twice making a second px");

	if (render) {
		if (render.name && render.group) {
			return forge.renderGroupByName(props);
		} else if (render.names && render.group) {
			return forge.renderGroupByNames(props);
		} else if (render?.name) {
			return forge.renderApp(props);
		} else if (render.names) {
			return forge.renderApps(props);
		} else if (render.group) {
			return forge.renderGroup(props);
		}
	}

	return forge.renderAll(props);
}

export type RenderAPI = typeof Render;
