import { sveltekit } from '@sveltejs/kit/vite';
import Icons from 'unplugin-icons/vite'
import { enhancedImages } from '@sveltejs/enhanced-img';
/** @type {import('vite').UserConfig} */
const config = {
	plugins: [enhancedImages(), sveltekit(),
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
