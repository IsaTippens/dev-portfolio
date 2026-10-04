import { load_entries } from '$lib/server/content';

export function load() {
	return { posts: load_entries('blog') };
}
