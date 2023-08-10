import type { Bug, Level } from "./game";

export type State = {
	bug: Bug;
	level: Level;
};

export const STATE: State = {
	bug: {
		direction: "up",
		position: { x: 0, y: 1 },
		program: {
			pc: 0,
			words: ["forward", "right", "forward", "right"],
		},
	},
	level: {
		width: 5,
		height: 5,
		// prettier-ignore
		tiles: [
			"wall", "wall",  "wall",   "wall",  "wall",
			"wall", "empty", "finish", "empty", "wall",
			"wall", "empty", "empty",  "empty", "wall",
			"wall", "empty", "start",  "empty", "wall",
			"wall", "wall",  "wall",   "wall",  "wall",
		],
	},
};
