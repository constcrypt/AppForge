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
		target?: GuiObject | Camera;
	};

	type ClassProps = AppProps & {
		forge: AppForge;
		px: ReturnType<typeof import("@rbxts/loners-pretty-react-hooks").usePx>;
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

export type MainProps = Types.MainProps;
export type NameProps = Types.NameProps;
export type ClassProps = Types.ClassProps;

export default Types;
