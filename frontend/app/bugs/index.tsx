import React from "react";

import Canvas2D from "../../Canvas2D";
import UserInterface from "./UserInterface";
import { draw } from "./graphics";

export function App() {
	return (
		<div className="relative h-full w-hull">
			<Canvas2D draw={draw} />
			<UserInterface />
		</div>
	);
}
