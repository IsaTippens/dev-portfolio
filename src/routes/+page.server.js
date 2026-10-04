import { load_entries } from '$lib/server/content';

/** The five newest posts; nothing else on the home page comes from the server. */
export function load() {
	return { posts: load_entries('blog').slice(0, 5) };
}
