// Types
import type AppForge from ".";

export function Render({
	props,
	manager,
	names,
}: {
	props: AppProps;
	manager: AppForge;
	names?: AppNames[number] | AppNames[number][];
}) {
	if (names) {
		if (typeIs(names, "table")) {
			return manager.renderApps(props, names);
		} else {
			return manager.renderApp(props, names);
		}
	}
	return manager.renderAll(props);
}
