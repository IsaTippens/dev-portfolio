import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import mdsvexConfig from './mdsvex.config.js';
import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [
		sveltekit({
			extensions: ['.svelte', ...mdsvexConfig.extensions],
			// mdsvex types `filename` as required; Svelte's preprocessor contract makes it optional.
			preprocess: [
				/** @type {import('svelte/compiler').PreprocessorGroup} */ (mdsvex(mdsvexConfig)),
				vitePreprocess()
			],
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
		})
	],
	build: {
		// The stylesheet already needs color-mix() and @property, and the CTF console uses
		// Promise.withResolvers, so nothing older than ES2022 runs this site. Native class
		// fields and #private members replace esbuild's WeakMap helpers in the bundle.
		target: 'es2022',
		// CSS keeps Vite's previous default target, so the stylesheet is minified exactly
		// as before.
		cssTarget: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14']
	},
	server: {
		fs: {
			allow: ['..']
		}
	}
};

export default config;
