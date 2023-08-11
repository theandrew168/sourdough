import React from "react";

import CanvasWebGL2 from "../../CanvasWebGL2";
import UserInterface from "./UserInterface";
import { Graphics } from "./graphics";

export function App() {
	const graphics = new Graphics();
	return (
		<div className="relative h-full w-full">
			<CanvasWebGL2 graphics={graphics} />
			<UserInterface />
		</div>
	);
}
