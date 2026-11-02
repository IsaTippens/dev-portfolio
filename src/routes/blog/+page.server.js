import { load_entries } from '#lib/server/content.js';

export function load() {
	return { posts: load_entries('blog') };
}
