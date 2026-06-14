import { sveltekit } from '@sveltejs/kit/vite';
import Icons from 'unplugin-icons/vite';
/** @type {import('vite').UserConfig} */
const config = {
	plugins: [
		sveltekit(),
		Icons({
			compiler: 'svelte'
		})
	],
	server: {
		fs: {
			allow: ['..']
		}
	},
	optimizeDeps: {
		exclude: ['virtual:icons', 'virtual:icons/*', '~icons/*'],
		esbuildOptions: {
			plugins: [
				{
					name: 'ignore-icons',
					setup(build) {
						build.onResolve({ filter: /^(virtual:icons\/|~icons\/)/ }, args => {
							return { path: args.path, external: true }
						})
					}
				}
			]
		}
	}
};

export default config;
