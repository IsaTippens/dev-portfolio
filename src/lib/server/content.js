import { dev } from '$app/environment';

/**
 * Frontmatter for every post under `content/<dir>`, newest first. Only `index.md` and
 * `index.svx` count, so a stray asset markdown file in a post folder can't produce a
 * second entry. Unpublished posts are dropped outside dev.
 *
 * @param {'blog' | 'projects'} dir
 */
export async function load_entries(dir) {
	const files = import.meta.glob('/content/**/index.{md,svx}');

	const entries = await Promise.all(
		Object.entries(files)
			.filter(([path]) => path.startsWith(`/content/${dir}/`))
			.map(async ([path, resolve]) => {
				const { metadata } = /** @type {any} */ (await resolve());
				const segments = path.split('/');
				return { meta: metadata, path: segments[segments.length - 2] };
			})
	);

	const visible = dev ? entries : entries.filter((entry) => entry.meta?.published);

	// Undated drafts sort last (as the epoch); a NaN comparator would scramble the list.
	const time = (/** @type {any} */ entry) => new Date(entry.meta?.date).getTime() || 0;
	return visible.sort((a, b) => time(b) - time(a));
}
