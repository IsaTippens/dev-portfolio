import { load_entries } from '$lib/server/content';
import { SITE, NAME, DESCRIPTION } from '$lib/site';

const escape = (value = '') =>
	String(value)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');

export async function GET() {
	const posts = await load_entries('blog');

	const items = posts
		.map(({ meta, path }) => {
			const url = `${SITE}/blog/${encodeURI(path)}`;
			return `		<item>
			<title>${escape(meta.title)}</title>
			<link>${escape(url)}</link>
			<guid isPermaLink="true">${escape(url)}</guid>
			<description>${escape(meta.description)}</description>
			<pubDate>${new Date(meta.date).toUTCString()}</pubDate>
		</item>`;
		})
		.join('\n');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<title>${escape(NAME)}</title>
		<link>${SITE}</link>
		<description>${escape(DESCRIPTION)}</description>
		<language>en</language>
		<atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml" />
${items}
	</channel>
</rss>
`;

	return new Response(xml, {
		headers: {
			'content-type': 'application/rss+xml; charset=utf-8',
			'cache-control': 'public, max-age=0, s-maxage=3600'
		}
	});
}
