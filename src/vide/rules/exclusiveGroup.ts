// Types
import type AppForge from "..";

// Components
import { AppRegistry } from "../decorator";

export default function ExclusiveGroupRule(entry: AppNames, forge: AppForge) {
	const entryApp = AppRegistry.get(entry);
	if (!entryApp?.rules?.exclusiveGroup) return;

	const group = entryApp.rules.exclusiveGroup;

	AppRegistry.forEach((app, name) => {
		if (name !== entry && app.rules?.exclusiveGroup === group) {
			if (forge.getSource(entry)()) forge.close(name);
		}
	});
}
