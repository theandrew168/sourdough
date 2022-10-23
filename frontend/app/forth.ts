import * as xterm from 'xterm';

import * as forth from '../forth/forth';

export async function main() {
	const interpreter = new forth.Intepreter();

	const term = new xterm.Terminal();
	const e = document.getElementById('terminal');
	if (!e) {
		throw 'Failed to find element with id: "terminal"';
	}

	term.open(e);
	term.write('forth> ');

	let pos = 0;
	let line = '';
	term.onKey((event) => {
		const code = event.key.charCodeAt(0);
		if (code === 10 || code === 13) {
			const result = interpreter.interpret(line) || ' ok';
			term.write('\r\n' + result);
			pos = 0;
			line = '';
			term.write('\r\nforth> ');
			return;
		}

		if (code === 127) {
			if (pos <= 0) return;
			pos -= 1;
			line = line.slice(0, line.length);
			term.write('\b \b');
			return;
		}

		if (code < 32) return;

		line += event.key;
		term.write(event.key);
	});
}
