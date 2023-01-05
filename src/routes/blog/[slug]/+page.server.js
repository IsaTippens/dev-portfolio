export async function load({ fetch, params }) {
  const { slug } = params;
  const res = await fetch(`/blog/${slug}`);
  const post = await res.json();
  return {
    post
  };
}