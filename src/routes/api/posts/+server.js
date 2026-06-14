import { dev } from '$app/environment';
import { json } from '@sveltejs/kit';
export const GET = async () => {
	// glob all md and svx files in the posts folder

	const allPostFiles = import.meta.glob('/content/blog/**/*.{md,svx}');
	const iterablePostFiles = Object.entries(allPostFiles);
	let allPosts = await Promise.all(
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

	if (!dev) {
		allPosts = allPosts.filter((post) => {
			return post.meta.published;
		});
	}

	const sortedPosts = allPosts.sort((a, b) => {
		return new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime();
	});

	return json(sortedPosts);
};
