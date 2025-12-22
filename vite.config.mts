import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
			'@/src-frontend': path.resolve(__dirname, 'src-frontend'),
			'@/src-backend': path.resolve(__dirname, 'src-backend'),
			'@/shared': path.resolve(__dirname, 'shared'),
		},
	},
});

export default config;
