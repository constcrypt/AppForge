// Types
import type AppForge from "..";

// Rules
import ExclusiveGroupRule from "./exclusiveGroup";
import ParentRule from "./parent";

export default class RulesManager {
	private processing = new Set<AppNames>();

	constructor(private forge: AppForge) {}

	public applyRules(name: AppNames) {
		if (this.processing.has(name)) return;
		this.processing.add(name);

		try {
			ParentRule(name, this.forge);
			ExclusiveGroupRule(name, this.forge);
		} finally {
			this.processing.delete(name);
		}
	}
}
