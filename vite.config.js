import { defineConfig } from 'vite';

export default defineConfig({
	clearScreen: false,
	build: {
		outDir: 'backend/web/public',
		target: 'es2022',
	},
});
