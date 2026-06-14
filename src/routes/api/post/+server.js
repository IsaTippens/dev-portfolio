import { json } from '@sveltejs/kit';

export const GET = async () => {
	const allPostFiles = import.meta.glob('/content/blog/**/*.md');
	const iterablePostFiles = Object.entries(allPostFiles);

	const allPosts = await Promise.all(
		iterablePostFiles.map(async ([path, resolver]) => {
			const { metadata } = /** @type {any} */ (await resolver());
			//get second last folder of path
			const temp = path.split('/');
			const postPath = temp[temp.length - 2];

			return {
				meta: metadata,
				path: postPath
			};
		})
	);

	const sortedPosts = allPosts.sort((a, b) => {
		return new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime();
	});

	const recent = sortedPosts[0];

	return json(recent);
};
