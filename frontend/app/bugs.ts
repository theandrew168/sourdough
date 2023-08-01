type Direction = 'up' | 'down' | 'left' | 'right';
type Position = {
	x: number;
	y: number;
}

type Word = 'forward' | 'right';
type Program = {
	pc: number;
	words: Word[];
}
type Bug = {
	direction: Direction;
	position: Position;
	program: Program;
}

const BUG_SIZE = 25;
const UNIT_SIZE = 50;

const step = function(bug: Bug) {
	const word = bug.program.words[bug.program.pc];
	if (!word) {
		return;
	}

	switch (word) {
		case 'forward': {
			switch (bug.direction) {
				case 'up': bug.position.y += 1; break;
				case 'down': bug.position.y -= 1; break;
				case 'left': bug.position.x -= 1; break;
				case 'right': bug.position.x += 1; break;
			}
			break;
		};
		case 'right': {
			switch (bug.direction) {
				case 'up': bug.direction = 'right'; break;
				case 'down': bug.direction = 'left'; break;
				case 'left': bug.direction = 'up'; break;
				case 'right': bug.direction = 'down'; break;
			}
			break;
		};
	}

	bug.program.pc += 1;
	bug.program.pc %= bug.program.words.length;
}

export async function main(canvas: HTMLCanvasElement) {
	const origin: Position = { x: 0, y: 0 };
	const square: Program = {
		pc: 0,
		words: [
			'forward',
			'right',
			'forward',
			'right',
			'forward',
			'right',
			'forward',
			'right',
		]
	}

	const bug: Bug = {
		direction: 'up',
		position: origin,
		program: square,
	}

	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight
	window.addEventListener('resize', (_event: UIEvent) => {
		canvas.width = canvas.clientWidth;
		canvas.height = canvas.clientHeight
	});

	canvas.addEventListener('mousedown', (_event: MouseEvent) => {
		step(bug);
		console.log(bug);
	});

	const maybeCtx = canvas.getContext("2d");
	if (!maybeCtx) {
		throw new Error("Canvas 2D not supported on this browser.");
	}

	const ctx: CanvasRenderingContext2D = maybeCtx;

	canvas.style.backgroundColor = 'ForestGreen';

	requestAnimationFrame(draw);
	function draw(_now: DOMHighResTimeStamp) {
		const center: Position = {
			x: canvas.width / 2,
			y: canvas.height / 2,
		}

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

		// bug dot
		ctx.fillStyle = "black";
		ctx.beginPath();
		ctx.arc(
			center.x + bug.position.x * UNIT_SIZE,
			center.y - bug.position.y * UNIT_SIZE,
			BUG_SIZE,
			0,
			2 * Math.PI,
		);
		ctx.fill();
		ctx.closePath();

		const dot: Position = {
			x: center.x + bug.position.x * UNIT_SIZE,
			y: center.y - bug.position.y * UNIT_SIZE,
		};
		switch (bug.direction) {
			case 'up': dot.y -= UNIT_SIZE / 2; break;
			case 'down': dot.y += UNIT_SIZE / 2; break;
			case 'left': dot.x -= UNIT_SIZE / 2; break;
			case 'right': dot.x += UNIT_SIZE / 2; break;
		}

		// direction dot
		ctx.fillStyle = "red";
		ctx.beginPath();
		ctx.arc(
			dot.x,
			dot.y,
			4,
			0,
			2 * Math.PI,
		);
		ctx.fill();
		ctx.closePath();

		requestAnimationFrame(draw);
	}
}
