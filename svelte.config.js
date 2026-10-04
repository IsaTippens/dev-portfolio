import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import mdsvexConfig from './mdsvex.config.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			routes: {
				include: ['/*'],
				// Static files never reach the Worker. `/images/*` replaces `<files>`, which emits
				// one rule per image and would outgrow _routes.json's 100-rule cap.
				exclude: [
					'<build>',
					'<prerendered>',
					'<redirects>',
					'/images/*',
					'/favicon.ico',
					'/favicon-16x16.png',
					'/favicon-32x32.png',
					'/og.png',
					'/robots.txt'
				]
			}
		})
	},
	extensions: ['.svelte', ...mdsvexConfig.extensions],
	preprocess: [mdsvex(mdsvexConfig), vitePreprocess()]
};

export default config;
