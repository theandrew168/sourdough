import React, { useState } from "react";
import type { OnDragEndResponder } from "react-beautiful-dnd";

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
