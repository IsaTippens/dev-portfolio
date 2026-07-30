export const load = async ({ fetch }) => {
	const res = await fetch(`/api/posts`);
	const allPosts = res.ok ? await res.json() : [];
	return {
		posts: Array.isArray(allPosts) ? allPosts : []
	};
};
