import { dev } from '$app/env';

/**
 * Frontmatter of every `content/<dir>/<slug>/index.{md,svx}`, resolved at build time.
 * Only each module's `metadata` export is imported, never the post component. Every
 * index file must carry frontmatter: a missing `metadata` export fails the build
 * rather than silently dropping the post.
 */
const metadata = import.meta.glob('/content/**/index.{md,svx}', { eager: true, import: 'metadata' });

/**
 * Frontmatter for every post under `content/<dir>`, newest first. Only `index.md` and
 * `index.svx` count, so a stray asset markdown file in a post folder can't produce a
 * second entry. Unpublished posts are dropped outside dev.
 *
 * @param {'blog' | 'projects'} dir
 * @returns {{ meta: any, path: string }[]}
 */
export function load_entries(dir) {
	const prefix = `/content/${dir}/`;
	const entries = Object.entries(metadata)
		.filter(([path]) => path.startsWith(prefix))
		.map(([path, meta]) => {
			const segments = path.split('/');
			return { meta: /** @type {any} */ (meta), path: segments[segments.length - 2] };
		});

	const visible = dev ? entries : entries.filter((entry) => entry.meta?.published);

	// Undated drafts sort last (as the epoch); a NaN comparator would scramble the list.
	const time = (/** @type {{ meta: any }} */ entry) => new Date(entry.meta?.date).getTime() || 0;
	return visible.sort((a, b) => time(b) - time(a));
}
