export const load = async ({ fetch }) => {
    const posts = await fetch(`/api/posts`);
    let allPosts = await posts.json();
    return {
        posts: allPosts
    };
};