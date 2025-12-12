// Types
import type AppForge from "..";

// Components
import { AppRegistry } from "../decorator";

export default function ParentRule(entry: AppNames, forge: AppForge) {
	const children = [] as AppNames[];

	AppRegistry.forEach((app, name) => {
		const rules = app.rules;
		if (!rules) return;

		if (rules.parent && rules.parent === entry) {
			if (entry === name)
				return warn(
					`${entry} tried to close ${name} either they have the same ID name or they ARE the same`,
				);

			if (!forge.sources.get(entry)!()) children.push(name);
		}
	});

	children.forEach((name) => forge.close(name));
}
