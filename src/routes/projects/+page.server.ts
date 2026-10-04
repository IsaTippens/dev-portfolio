import { load_entries } from '$lib/server/content';

export const load = () => ({ posts: load_entries('projects') });
