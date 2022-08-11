import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		outDir: 'backend/web/public',
		target: 'es2022',
	},
	clearScreen: false,
	publicDir: 'frontend/public',
});
