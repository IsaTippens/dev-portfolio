/** Every project folder becomes a static page; `auto` keeps the route on the Worker for 404s. */
export const prerender = 'auto';

/** @type {import('./$types').EntryGenerator} */
export function entries() {
	return Object.keys(import.meta.glob('/content/projects/*/index.md')).map((path) => ({
		slug: path.split('/')[3]
	}));
}
