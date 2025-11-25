// Types
import type { Args } from "./decorator";

declare namespace Types {
	type AppRegistryProps = {
		name: AppNames[number];
		visible?: boolean;
		rules?: Rules.All;
	};

	type AppRegistry = {
		constructor: new (props: AppProps) => Args;
		visible?: boolean;
		rules?: Rules.All;
	};

	namespace Rules {
		type Groups = AppGroups[number] | "Core" | "Core"[] | AppGroups[number][];
		type BlockedBy = AppNames[number] | AppNames[number][];
		type Blocks = AppNames[number] | AppNames[number][];
		type Exclusive = boolean;
		type Layer = number;

		type All = {
			blockedBy?: BlockedBy;
			exclusive?: Exclusive;
			groups?: Groups;
			blocks?: Blocks;
			layer?: Layer;
		};
	}
}

export default Types;
