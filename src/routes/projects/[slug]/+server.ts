import { posts } from "./_posts";
import { json } from '@sveltejs/kit';
import { fail } from "@sveltejs/kit";
export function GET({ params }) {
    const { slug } = params;
    const post = posts.find(post => post.slug === slug);

    if (!post) {
        return fail(404)
    }
    return json(post);
}