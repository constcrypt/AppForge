// Types
import type { Args } from "./decorator";
import type AppForge from ".";

declare namespace Types {
	namespace Props {
		type Name = { name?: AppNames; names?: undefined } | { names?: AppNames[]; name?: undefined };

		type Main = {
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

		type Class = AppProps & {
			forge: AppForge;
			px: typeof import("@rbxts/loners-pretty-vide-utils").px;
		};
	}

	namespace AppRegistry {
		type Props<N extends AppNames> = {
			name: N;
			visible?: boolean;
			rules?: Rules.Generic<N>;
		};

		type Static = {
			constructor: new (props: Types.Props.Main) => Args;
			visible?: boolean;
			rules?: Rules.Static;
		};

		type Generic<N extends AppNames = AppNames> = {
			constructor: new (props: Types.Props.Main) => Args;
			visible?: boolean;
			rules?: Rules.Generic<N>;
		};
	}

	namespace Rules {
		type Static = {
			parent?: string;
			exclusiveGroup?: string;
		};

		type Generic<N extends AppNames = AppNames> = {
			parent?: Exclude<AppNames, N>;
			exclusiveGroup?: GroupNames;
		};
	}
}

export type NameProps = Types.Props.Name;
export type MainProps = Types.Props.Main;
export type ClassProps = Types.Props.Class;

export default Types;
