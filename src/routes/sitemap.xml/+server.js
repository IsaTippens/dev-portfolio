import { load_entries } from '#lib/server/content.js';
import { SITE } from '#lib/site.js';

const STATIC_ROUTES = ['/', '/blog', '/projects', '/gear', '/gaming'];

/** @param {string} path */
const url = (path) => ({
	loc: `${SITE}${encodeURI(path)}`,
	lastmod: null
});

export const prerender = true;

export function GET() {
	const posts = load_entries('blog');
	const projects = load_entries('projects');

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
		headers: { 'content-type': 'application/xml; charset=utf-8' }
	});
}
