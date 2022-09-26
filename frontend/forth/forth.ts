export class Forth {
	private ds: number[];

	constructor() {
		this.ds = [];
	}

	public interpret(source: string): string {
		let output: string = '';

		const tokens = this.lex(source);
		tokens.forEach((token) => {
			switch (token) {
				case '+': {
					const a = this.ds.pop()!;
					const b = this.ds.pop()!;
					const c = a + b;
					this.ds.push(c);
					break;
				}
				case '-': {
					const a = this.ds.pop()!;
					const b = this.ds.pop()!;
					const c = a - b;
					this.ds.push(c);
					break;
				}
				case '*': {
					const a = this.ds.pop()!;
					const b = this.ds.pop()!;
					const c = a * b;
					this.ds.push(c);
					break;
				}
				case '/': {
					const a = this.ds.pop()!;
					const b = this.ds.pop()!;
					const c = a / b;
					this.ds.push(c);
					break;
				}
				case 'CR': {
					output += '\n';
					break;
				}
				case '.': {
					const a = this.ds.pop()!;
					output += a.toString();
					break;
				}
				default:
					this.ds.push(Number(token));
					break;
			}
		});

		return output;
	}

	private lex(source: string): string[] {
		return source.split(/\s+/);
	}
}
