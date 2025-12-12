// Types
import type AppForge from "..";

// Rules
import ParentRule from "./parent";

export default class RulesManager {
	constructor(private forge: AppForge) {}

	public applyRules(name: AppNames) {
		ParentRule(name, this.forge);
	}
}
