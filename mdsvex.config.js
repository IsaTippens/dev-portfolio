/* eslint-disable */
import { visit } from 'unist-util-visit';

/**
 * Markdown images decode off the main thread, and every one after a post's first
 * waits until the reader approaches it; the first stays eager because it is often
 * above the fold. Raw HTML <img> and Svelte components in posts are left alone.
 */
function lazyImages() {
	return (tree) => {
		let seen = 0;
		visit(tree, 'element', (node) => {
			if (node.tagName !== 'img') return;
			node.properties.decoding = 'async';
			if (seen++ > 0) node.properties.loading = 'lazy';
		});
	};
}

const config = {
	extensions: ['.svelte.md', '.md', '.svx'],
	rehypePlugins: [lazyImages]
};

export default config;
