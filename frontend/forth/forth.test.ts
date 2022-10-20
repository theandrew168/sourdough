import '@jest/globals';

import * as forth from './forth';

describe('forth', () => {
	test('interpret basic sequence', () => {
		const f = new forth.Intepreter();
		const output = f.interpret('25 10 * 50 + .');
		expect(output).toEqual('300');
	});

	test('interpret basic meta word', () => {
		const f = new forth.Intepreter();
		const output = f.interpret(': ADD2 2 + ; 5 ADD2 .');
		expect(output).toEqual('7');
	});
});
