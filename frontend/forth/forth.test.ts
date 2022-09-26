import '@jest/globals';

import * as forth from './forth';

describe('forth', () => {
	test('interpret basic sequence', () => {
		const f = new forth.Forth();
		const output = f.interpret('25 10 * 50 + .');
		expect(output).toEqual('300');
	});
});
