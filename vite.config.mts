import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';

const config = defineConfig({
	plugins: [react()],
	server: {
		port: 3000,
		host: true,
	},
	build: {
		outDir: 'dist',
		emptyOutDir: true,
	},
	assetsInclude: ['**/*.svg'],
	css: {
		preprocessorOptions: {
			scss: {
				api: 'modern-compiler',
			},
		},
	},
	resolve: {
		alias: {
			'@/src-frontend': path.resolve(import.meta.url, './src-frontend'),
			'@/src-backend': path.resolve(import.meta.url, './src-backend'),
		},
	},
});

export default config;
