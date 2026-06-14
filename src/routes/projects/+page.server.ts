export const load = async ({ fetch }) => {
	const posts = await fetch(`/api/projects`);
	const allPosts = await posts.json();
	return {
		posts: allPosts
	};
};
