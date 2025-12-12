// Types
import type { Args } from "./decorator";
import type AppForge from ".";

declare namespace Types {
	type AppRegistryProps = {
		name: AppNames;
		visible?: boolean;
		rules?: Rules.All;
	};

	type NameProps =
		| { name?: AppNames; names?: undefined }
		| { names?: AppNames[]; name?: undefined };

	type MainProps = {
		props: AppProps;
		forge: AppForge;
		config?: {
			px: {
				target?: GuiObject | Camera;
				resolution?: Vector2;
				minScale?: number;
			};
		};
	};

	type ClassProps = AppProps & {
		forge: AppForge;
		px: typeof import("@rbxts/loners-pretty-vide-utils").px;
	};

	type AppRegistry = {
		constructor: new (props: MainProps) => Args;
		visible?: boolean;
		rules?: Rules.All;
	};

	namespace Rules {
		type All = {
			parent?: AppNames;
		};
	}
}

export type NameProps = Types.NameProps;
export type MainProps = Types.MainProps;
export type ClassProps = Types.ClassProps;

export default Types;
