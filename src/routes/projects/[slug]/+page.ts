import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
	const { slug } = params;

	try {
		const post = await import(`../../../../content/projects/${slug}/index.md`);
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
