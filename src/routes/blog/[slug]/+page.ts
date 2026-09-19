import { error, redirect } from '@sveltejs/kit';

/**
 * Slugs that were not URL-safe when they were written. Every post folder is now
 * lowercase-kebab; the old addresses keep working with a permanent redirect rather than
 * 404ing, because a link that has been published once is a promise.
 */
const LEGACY_SLUGS: Record<string, string> = {
	'Recap 2023': 'recap-2023',
	'why league sucks': 'why-league-sucks',
	Note: 'note'
};

export const load = async ({ params }) => {
	const { slug } = params;

	const canonical = LEGACY_SLUGS[slug];
	if (canonical) {
		throw redirect(308, `/blog/${canonical}`);
	}

	try {
		// The slug is chosen at runtime by the visitor, so the module specifier cannot be
		// static; Vite turns this into an on-demand chunk per post.
		const post = await import(`../../../../content/blog/${slug}/index.md`);
		return {
			Content: post.default,
			meta: { ...post.metadata, slug }
		};
	} catch (err) {
		throw error(404, {
			message: err instanceof Error ? err.message : 'Not Found'
		});
	}
};
