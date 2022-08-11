module.exports = {
	root: true,
	extends: ['eslint:recommended', 'prettier'],
	parserOptions: {
		sourceType: 'module',
	},
	env: {
		browser: true,
		es2022: true,
		node: true
	}
};
