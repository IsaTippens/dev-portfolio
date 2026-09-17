import { load_entries } from '$lib/server/content';
import { SITE } from '$lib/site';

const STATIC_ROUTES = ['/', '/blog', '/projects', '/gear'];

/** @param {string} path */
const url = (path) => ({
	loc: `${SITE}${encodeURI(path)}`,
	lastmod: null
});

export async function GET() {
	const [posts, projects] = await Promise.all([load_entries('blog'), load_entries('projects')]);

	const entries = [
		...STATIC_ROUTES.map(url),
		...posts.map((post) => ({
			loc: `${SITE}/blog/${encodeURI(post.path)}`,
			lastmod: post.meta.date ? new Date(post.meta.date).toISOString() : null
		})),
		...projects.map((project) => ({
			loc: `${SITE}/projects/${encodeURI(project.path)}`,
			lastmod: project.meta.date ? new Date(project.meta.date).toISOString() : null
		}))
	];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
	.map(
		(entry) =>
			`	<url>
		<loc>${entry.loc}</loc>${entry.lastmod ? `\n		<lastmod>${entry.lastmod}</lastmod>` : ''}
	</url>`
	)
	.join('\n')}
</urlset>
`;

	return new Response(xml, {
		headers: {
			'content-type': 'application/xml; charset=utf-8',
			'cache-control': 'public, max-age=0, s-maxage=3600'
		}
	});
}
