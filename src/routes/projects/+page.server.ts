import { load_entries } from '#lib/server/content.js';

export const load = () => ({ posts: load_entries('projects') });
