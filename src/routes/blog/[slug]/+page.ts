export const load = async ({
    params,
  }) => {
    const { slug } = params
  
    try {
      const post = await import(`/content/blog/${slug}/index.md`)
      return {
        Content: post.default,
        meta: { ...post.metadata, slug },
      }
    } catch (err) {
      return {
        status: 404,
        error: err,
      }
    }
  }
  