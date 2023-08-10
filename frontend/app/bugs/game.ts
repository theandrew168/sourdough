export type Direction = "up" | "down" | "left" | "right";
export type Position = {
	x: number;
	y: number;
};

export type Word = "forward" | "right" | "left";
export type Program = {
	pc: number;
	words: Word[];
};
export type Bug = {
	direction: Direction;
	position: Position;
	program: Program;
};

export type Tile = "start" | "finish" | "empty" | "wall";
export type Level = {
	width: number;
	height: number;
	// row-major
	tiles: Tile[];
};

export const getTile = (level: Level, x: number, y: number): Tile => {
	if (x < 0 || x >= level.width) {
		return "wall";
	}
	if (y < 0 || y >= level.height) {
		return "wall";
	}

	return level.tiles[y * level.width + x] as Tile;
};

export const step = (bug: Bug): Bug => {
	// deep copy the current bug
	const newBug: Bug = {
		...bug,
		position: {
			...bug.position,
		},
		program: {
			...bug.program,
		},
	};

	const word = bug.program.words[bug.program.pc];
	if (!word) {
		throw new Error("Invalid program index");
	}

	switch (word) {
		case "forward": {
			switch (bug.direction) {
				case "up":
					newBug.position.y -= 1;
					break;
				case "down":
					newBug.position.y += 1;
					break;
				case "left":
					newBug.position.x -= 1;
					break;
				case "right":
					newBug.position.x += 1;
					break;
			}
			break;
		}
		case "right": {
			switch (bug.direction) {
				case "up":
					newBug.direction = "right";
					break;
				case "down":
					newBug.direction = "left";
					break;
				case "left":
					newBug.direction = "up";
					break;
				case "right":
					newBug.direction = "down";
					break;
			}
			break;
		}
		case "left": {
			switch (bug.direction) {
				case "up":
					newBug.direction = "left";
					break;
				case "down":
					newBug.direction = "right";
					break;
				case "left":
					newBug.direction = "down";
					break;
				case "right":
					newBug.direction = "up";
					break;
			}
			break;
		}
	}

	newBug.program.pc += 1;
	newBug.program.pc %= newBug.program.words.length;
	return newBug;
};

export const tryStepBug = (bug: Bug, level: Level): Bug => {
	const newBug = step(bug);
	// HACK: bug coords vs level coords
	const tile = getTile(level, newBug.position.x + 2, newBug.position.y + 2);
	if (tile === "wall") {
		return bug;
	}
	if (tile === "finish") {
		alert("You win!");
	}
	return newBug;
};
