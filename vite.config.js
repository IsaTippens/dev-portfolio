import { sveltekit } from '@sveltejs/kit/vite';
import Icons from 'unplugin-icons/vite'
/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit(),
	Icons({
		compiler: 'svelte'
	})
	],
	server: {
		fs: {
			allow: ['..'],
		}
	}
};

export default config;
