import * as xterm from 'xterm';

export async function main() {
	const term = new xterm.Terminal();
	const e = document.getElementById('terminal');
	if (!e) {
		throw 'Failed to find element with id: "terminal"';
	}

	console.log(e);
	term.open(e);
	term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ');
}
