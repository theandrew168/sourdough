import { loadImage } from "../../gfx/asset";
import { Renderer2D } from "../../webgl/renderer";
import { Sprite } from "../../webgl/sprite";
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

export const draw = (dt: number, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
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

export class Graphics {
	private renderer: Renderer2D | null;
	private isInitDone: boolean;

	constructor() {
		this.renderer = null;
		this.isInitDone = false;

		this.init = this.init.bind(this);
		this.draw = this.draw.bind(this);
	}

	public async init(canvas: HTMLCanvasElement, gl: WebGL2RenderingContext) {
		const spritesheet = await loadImage("/static/texture/countryside.png", true);
		this.renderer = new Renderer2D(canvas, gl, spritesheet);

		this.isInitDone = true;
	}

	public draw(_time: number) {
		if (!this.isInitDone) {
			return;
		}

		if (!this.renderer) {
			throw new Error("Renderer has not been initialized!");
		}

		const countryside = new Sprite(64, 64);
		const grass = countryside.slice(32, 32, 0, 0);
		const flower = countryside.slice(32, 32, 0, 1);
		const boxFront = countryside.slice(32, 32, 1, 0);
		const boxTop = countryside.slice(32, 32, 1, 1);

		this.renderer.draw(countryside, { x: 0, y: 0, r: _time / 10 });
		this.renderer.draw(countryside, { x: 64, y: 0 });
		this.renderer.draw(countryside, { x: -64, y: 0 });
		this.renderer.draw(countryside, { x: 0, y: 64 });
		this.renderer.draw(countryside, { x: 0, y: -64 });
		this.renderer.draw(countryside, { x: 128, y: 128, sx: 3, sy: 3 });
		this.renderer.draw(countryside, { x: -96, y: -96, sx: 2, sy: 2 });
		this.renderer.draw(countryside, { x: 0, y: -192, sx: Math.abs(Math.sin(_time / 1000)) * 5 });
		this.renderer.draw(countryside, { x: Math.sin(_time / 500) * 256, y: Math.cos(_time / 500) * 256 });
		this.renderer.draw(countryside, { x: 192, y: 0, r: _time / 10 });
		this.renderer.draw(grass, { x: -128, y: 0, sx: 2, sy: 2 });
		this.renderer.draw(flower, { x: -192, y: 0, sx: 2, sy: 2 });
		this.renderer.draw(boxFront, { x: -256, y: 0, sx: 2, sy: 2 });
		this.renderer.draw(boxTop, { x: -256, y: 64, sx: 2, sy: 2 });
		this.renderer.flush();
	}
}
