import React, { useState } from "react";
import type { OnDragEndResponder } from "react-beautiful-dnd";

import { DragAndDrop, Drag, Drop, reorder } from "./dnd";
import Canvas2D from "./Canvas2D";

const BUG_SIZE = 25;
const UNIT_SIZE = 50;

type Direction = "up" | "down" | "left" | "right";
type Position = {
	x: number;
	y: number;
};

type Word = "forward" | "right" | "left";
type Program = {
	pc: number;
	words: Word[];
};
type Bug = {
	direction: Direction;
	position: Position;
	program: Program;
};

type Tile = "start" | "finish" | "empty" | "wall";
type Map = {
	width: number;
	height: number;
	// row-major
	tiles: Tile[];
};

const getTile = (map: Map, x: number, y: number): Tile => {
	if (x < 0 || x >= map.width) {
		return "wall";
	}
	if (y < 0 || y >= map.height) {
		return "wall";
	}

	return map.tiles[y * map.width + x] as Tile;
};

const step = (bug: Bug): Bug => {
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
	console.log(newBug);
	return newBug;
};

const drawBug = (bug: Bug, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
	const center: Position = {
		x: canvas.width / 2,
		y: canvas.height / 2,
	};

	const bugWorldPosition: Position = {
		x: center.x + bug.position.x * UNIT_SIZE,
		y: center.y + bug.position.y * UNIT_SIZE,
	};

	// position dot
	ctx.fillStyle = "black";
	ctx.beginPath();
	ctx.arc(bugWorldPosition.x, bugWorldPosition.y, BUG_SIZE, 0, 2 * Math.PI);
	ctx.fill();
	ctx.closePath();

	const dotWorldPosition: Position = { ...bugWorldPosition };
	switch (bug.direction) {
		case "up":
			dotWorldPosition.y -= UNIT_SIZE / 2;
			break;
		case "down":
			dotWorldPosition.y += UNIT_SIZE / 2;
			break;
		case "left":
			dotWorldPosition.x -= UNIT_SIZE / 2;
			break;
		case "right":
			dotWorldPosition.x += UNIT_SIZE / 2;
			break;
	}

	// direction dot
	ctx.fillStyle = "red";
	ctx.beginPath();
	ctx.arc(dotWorldPosition.x, dotWorldPosition.y, 4, 0, 2 * Math.PI);
	ctx.fill();
	ctx.closePath();
};

export function App() {
	const [bug, setBug] = useState<Bug>({
		direction: "up",
		position: { x: 0, y: 1 },
		program: {
			pc: 0,
			words: ["forward", "right", "forward", "right"],
		},
	});

	const map: Map = {
		width: 5,
		height: 5,
		// prettier-ignore
		tiles: [
			"wall", "wall", "wall", "wall", "wall",
			"wall", "empty", "finish", "empty", "wall",
			"wall", "empty", "empty", "empty", "wall",
			"wall", "empty", "start", "empty", "wall",
			"wall", "wall", "wall", "wall", "wall",
		],
	};

	const tryStepBug = (bug: Bug, map: Map) => {
		const newBug = step(bug);
		// HACK: bug coords vs map coords
		const tile = getTile(map, newBug.position.x + 2, newBug.position.y + 2);
		if (tile === "wall") {
			return;
		}
		if (tile === "finish") {
			alert("You win!");
		}
		setBug(newBug);
	};

	const draw = (_time: DOMHighResTimeStamp, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
		// ensure canvas is properly sized
		canvas.width = canvas.clientWidth;
		canvas.height = canvas.clientHeight;

		// set background color
		canvas.style.backgroundColor = "black";

		// clear the canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// draw the map
		const mapWidth = map.width * UNIT_SIZE;
		const mapHeight = map.height * UNIT_SIZE;
		for (let y = 0; y < map.height; y++) {
			for (let x = 0; x < map.width; x++) {
				const tile = getTile(map, x, y);
				switch (tile) {
					case "start":
						ctx.fillStyle = "green";
						break;
					case "finish":
						ctx.fillStyle = "white";
						break;
					case "empty":
						ctx.fillStyle = "green";
						break;
					case "wall":
						ctx.fillStyle = "gray";
						break;
				}

				const center: Position = {
					x: canvas.width / 2,
					y: canvas.height / 2,
				};
				ctx.fillRect(
					x * UNIT_SIZE + center.x - mapWidth / 2,
					y * UNIT_SIZE + center.y - mapHeight / 2,
					UNIT_SIZE,
					UNIT_SIZE,
				);
			}
		}

		// draw the bug!
		drawBug(bug, ctx, canvas);
	};

	const [isEditOpen, setIsEditOpen] = useState(false);

	const handleDragEnd: OnDragEndResponder = (result) => {
		const { source, destination } = result;

		if (!destination) {
			return;
		}

		const reorderedItems = reorder(bug.program.words, source.index, destination.index);
		setBug({ direction: "up", position: { x: 0, y: 1 }, program: { pc: 0, words: reorderedItems } });
	};

	return (
		<div className="relative h-full w-hull">
			<Canvas2D draw={draw} />
			<div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white p-4 font-mono">
				<button className="border border-white p-2 mr-4" onClick={() => tryStepBug(bug, map)}>
					Step
				</button>
				<button className="border border-white p-2" onClick={() => setIsEditOpen(!isEditOpen)}>
					Edit
				</button>
				{isEditOpen && (
					<div className="border border-white p-2 mt-4">
						<DragAndDrop onDragEnd={handleDragEnd}>
							<Drop id="droppable-id">
								{bug.program.words.map((item, index) => {
									return (
										<Drag key={index} id={index.toString()} index={index}>
											<span>{item}</span>
										</Drag>
									);
								})}
							</Drop>
						</DragAndDrop>
					</div>
				)}
			</div>
		</div>
	);
}
