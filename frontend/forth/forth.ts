type Stack = {
	push(n: number): void;
	pop(): number | undefined;
};

type Word = (stack: Stack) => void;
type Dict = Record<string, Word>;

const Add: Word = (stack: Stack) => {
	const a = stack.pop()!;
	const b = stack.pop()!;
	stack.push(a + b);
};

const Mul: Word = (stack: Stack) => {
	const a = stack.pop()!;
	const b = stack.pop()!;
	stack.push(a * b);
};

const arithmetic: Dict = {
	'+': Add,
	'*': Mul,
};

function literal(n: number): Word {
	return (stack: Stack) => {
		stack.push(n);
	};
}

function meta(words: Word[]): Word {
	return (stack: Stack) => {
		words.forEach((word) => word(stack));
	};
}

export class Intepreter {
	private stack: Stack;
	private dict: Dict;
	private mode: 'compile' | 'interpret';

	constructor() {
		this.stack = [] as number[];
		this.dict = { ...arithmetic };
		this.mode = 'interpret';
	}

	public interpret(source: string): string {
		let name: string = '';
		let words: Word[] = [];
		let output: string = '';

		const tokens = this.lex(source);
		tokens.forEach((token) => {
			// special token: switch to compile mode
			if (token === ':') {
				name = '';
				words = [];
				this.mode = 'compile';
				return;
			}

			// special token: switch to interpret mode
			if (token === ';') {
				this.dict[name] = meta(words);
				this.mode = 'interpret';
				return;
			}

			// compile word if in compile mode
			if (this.mode === 'compile') {
				// set name of word being compiled
				if (!name) {
					name = token;
					return;
				}

				const word = this.dict[token];
				if (word) {
					words.push(word);
				} else {
					words.push(literal(Number(token)));
				}

				return;
			}

			// default to interpreting input

			// special token: pop and emit top of stack
			if (token === '.') {
				const item = this.stack.pop();
				if (item == null) {
					output = 'error: empty stack';
					return;
				}

				output += item.toString();
				return;
			}

			// lookup a word, execute if found, else push number onto stack
			const word = this.dict[token];
			if (word) {
				word(this.stack);
			} else if (Number.isNaN(Number(token))) {
				output = 'error: invalid number';
			} else {
				this.stack.push(Number(token));
			}
		});

		return output;
	}

	private lex(source: string): string[] {
		return source.split(/\s+/);
	}
}
