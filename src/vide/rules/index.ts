// Types
import type AppForge from "..";

// Rules
import ExclusiveGroupRule from "./exclusiveGroup";
import ParentRule from "./parent";

export default class RulesManager {
	constructor(private forge: AppForge) {}

	public applyRules(name: AppNames) {
		ExclusiveGroupRule(name, this.forge);
		ParentRule(name, this.forge);
	}
}
