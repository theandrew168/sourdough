import { getTile, type Bug, type Position } from "./game";
import { STATE } from "./state";

const BUG_SIZE = 25;
const UNIT_SIZE = 50;

export const drawBug = (bug: Bug, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
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

export const draw = (_time: DOMHighResTimeStamp, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
	// ensure canvas is properly sized
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;

	// set background color
	canvas.style.backgroundColor = "black";

	// clear the canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// draw the map
	const mapWidth = STATE.level.width * UNIT_SIZE;
	const mapHeight = STATE.level.height * UNIT_SIZE;
	for (let y = 0; y < STATE.level.height; y++) {
		for (let x = 0; x < STATE.level.width; x++) {
			const tile = getTile(STATE.level, x, y);
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
	drawBug(STATE.bug, ctx, canvas);
};
