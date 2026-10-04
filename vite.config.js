import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
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
