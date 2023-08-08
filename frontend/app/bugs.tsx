import React, { useEffect, useRef, useState } from "react";
import type { OnDragEndResponder } from "react-beautiful-dnd";

import { DragAndDrop, Drag, Drop, reorder } from "../dnd";

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

const BUG_SIZE = 25;
const UNIT_SIZE = 50;

const step = function (bug: Bug): Bug {
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
					newBug.position.y += 1;
					break;
				case "down":
					newBug.position.y -= 1;
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

const drawBug = function (bug: Bug, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
	const center: Position = {
		x: canvas.width / 2,
		y: canvas.height / 2,
	};

	const bugWorldPosition: Position = {
		x: center.x + bug.position.x * UNIT_SIZE,
		y: center.y - bug.position.y * UNIT_SIZE,
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
		position: { x: 0, y: 0 },
		program: {
			pc: 0,
			words: ["forward", "right", "forward", "right", "forward", "right", "forward", "right"],
		},
	});

	const canvasRef = useRef<HTMLCanvasElement>(null);

	// redraw when the bug changes
	// TODO: redraw upon window resize (track size in state)
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) {
			throw new Error("Failed to find canvas.");
		}

		canvas.width = canvas.clientWidth;
		canvas.height = canvas.clientHeight;

		const ctx = canvas.getContext("2d");
		if (!ctx) {
			throw new Error("Canvas 2D not supported on this browser.");
		}

		// set background color
		canvas.style.backgroundColor = "ForestGreen";

		let requestId = 0;
		const draw = (now: DOMHighResTimeStamp) => {
			// clear the canvas
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			// horizontal line
			ctx.fillStyle = "black";
			ctx.beginPath();
			ctx.moveTo(-canvas.width, canvas.height / 2);
			ctx.lineTo(canvas.width, canvas.height / 2);
			ctx.stroke();
			ctx.closePath();

			// vertical line
			ctx.fillStyle = "black";
			ctx.beginPath();
			ctx.moveTo(canvas.width / 2, -canvas.height);
			ctx.lineTo(canvas.width / 2, canvas.height);
			ctx.stroke();
			ctx.closePath();

			// draw the bug!
			drawBug(bug, ctx, canvas);

			requestId = requestAnimationFrame(draw);
		};
		requestId = requestAnimationFrame(draw);

		return () => {
			cancelAnimationFrame(requestId);
		};
	}, [bug]);

	const [isEditOpen, setIsEditOpen] = useState(false);

	const handleDragEnd: OnDragEndResponder = (result) => {
		const { source, destination } = result;

		if (!destination) {
			return;
		}

		const reorderedItems = reorder(bug.program.words, source.index, destination.index);
		setBug({ ...bug, program: { ...bug.program, words: reorderedItems } });
	};

	return (
		<div className="relative h-full w-hull">
			<canvas className="h-full w-full" ref={canvasRef}></canvas>
			<div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white p-4 font-mono">
				<button className="border border-white p-2 mr-4" onClick={() => setBug(step(bug))}>
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
