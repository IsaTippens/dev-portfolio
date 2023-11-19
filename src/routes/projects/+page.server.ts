export const load = async ({ fetch }) => {
    const posts = await fetch(`/api/projects`);
    let allPosts = await posts.json();
    return {
        posts: allPosts
    };
};