import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		outDir: 'backend/web/public',
	},
	clearScreen: false,
	publicDir: 'frontend/public',
});
