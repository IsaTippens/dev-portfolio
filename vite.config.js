import { sveltekit } from '@sveltejs/kit/vite';
import {searchForWorkspaceRoot } from 'vite'

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	server: {
		fs: {
		  allow: ['..'],
		}
	  }
};

export default config;
