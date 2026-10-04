/**
 * Every post folder — published or not, each already renders at its URL — becomes a
 * static page. `auto` keeps the route on the Worker for everything else: the
 * LEGACY_SLUGS 308 redirects in +page.ts and 404s.
 */
export const prerender = 'auto';

/** @type {import('./$types').EntryGenerator} */
export function entries() {
	return Object.keys(import.meta.glob('/content/blog/*/index.md')).map((path) => ({
		slug: path.split('/')[3]
	}));
}
