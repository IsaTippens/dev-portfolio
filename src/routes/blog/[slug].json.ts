
import { posts } from "./_posts";

export async function GET({ params }) {
  console.log({posts})
  const { slug } = params;

  const temp = Object.keys(posts).map(key => posts[key]);
  console.log({temp})
  const post = temp.find(post => post.slug === slug);

  if (!post) {
    return {
      status: 404,
      body: "Not found",
    }
  }
  return {
    status: 200,
    body: { post }
  }

}