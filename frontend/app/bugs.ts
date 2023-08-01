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
const BUG_TICK_MS = 250;

const step = function (bug: Bug) {
	const word = bug.program.words[bug.program.pc];
	if (!word) {
		return;
	}

	switch (word) {
		case "forward": {
			switch (bug.direction) {
				case "up":
					bug.position.y += 1;
					break;
				case "down":
					bug.position.y -= 1;
					break;
				case "left":
					bug.position.x -= 1;
					break;
				case "right":
					bug.position.x += 1;
					break;
			}
			break;
		}
		case "right": {
			switch (bug.direction) {
				case "up":
					bug.direction = "right";
					break;
				case "down":
					bug.direction = "left";
					break;
				case "left":
					bug.direction = "up";
					break;
				case "right":
					bug.direction = "down";
					break;
			}
			break;
		}
		case "left": {
			switch (bug.direction) {
				case "up":
					bug.direction = "left";
					break;
				case "down":
					bug.direction = "right";
					break;
				case "left":
					bug.direction = "down";
					break;
				case "right":
					bug.direction = "up";
					break;
			}
			break;
		}
	}

	bug.program.pc += 1;
	bug.program.pc %= bug.program.words.length;
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

export async function main(canvas: HTMLCanvasElement) {
	const squareCW: Program = {
		pc: 0,
		words: ["forward", "right", "forward", "right", "forward", "right", "forward", "right"],
	};
	const squareCCW: Program = {
		pc: 0,
		words: ["forward", "left", "forward", "left", "forward", "left", "forward", "left"],
	};
	const bigSquare: Program = {
		pc: 0,
		words: [
			"forward",
			"forward",
			"forward",
			"forward",
			"right",
			"forward",
			"forward",
			"forward",
			"forward",
			"right",
			"forward",
			"forward",
			"forward",
			"forward",
			"right",
			"forward",
			"forward",
			"forward",
			"forward",
			"right",
		],
	};

	const bugs: Bug[] = [
		{
			direction: "up",
			position: { x: 0, y: 0 },
			program: { ...squareCW },
		},
		{
			direction: "down",
			position: { x: -1, y: 0 },
			program: { ...squareCCW },
		},
		{
			direction: "right",
			position: { x: -2, y: 2 },
			program: { ...bigSquare },
		},
	];

	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
	window.addEventListener("resize", (_event: UIEvent) => {
		canvas.width = canvas.clientWidth;
		canvas.height = canvas.clientHeight;
	});

	canvas.addEventListener("mousedown", (_event: MouseEvent) => {
		bugs.forEach((bug) => step(bug));
	});

	const maybeCtx = canvas.getContext("2d");
	if (!maybeCtx) {
		throw new Error("Canvas 2D not supported on this browser.");
	}

	const ctx: CanvasRenderingContext2D = maybeCtx;

	canvas.style.backgroundColor = "ForestGreen";

	let tick = 0;

	requestAnimationFrame(draw);
	function draw(now: DOMHighResTimeStamp) {
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

		if (now - tick >= BUG_TICK_MS) {
			bugs.forEach((bug) => step(bug));
			tick = now;
		}
		bugs.forEach((bug) => drawBug(bug, ctx, canvas));

		requestAnimationFrame(draw);
	}
}
