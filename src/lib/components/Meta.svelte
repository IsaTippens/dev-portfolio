<script lang="ts">
	/**
	 * Per-page head metadata. `path` is resolved against the canonical origin for the
	 * canonical link and og:url, so every page shares one set of card/OG tags.
	 */
	let {
		title,
		description,
		path = '/',
		type = 'website',
		published = null
	} = $props<{
		title: string;
		description: string;
		path?: string;
		type?: 'website' | 'article';
		published?: string | Date | null;
	}>();

	const SITE = 'https://isatippens.com';
	const NAME = 'Isa Tippens';

	const url = $derived(`${SITE}${path === '/' ? '' : encodeURI(path)}`);
	const full_title = $derived(title === NAME ? title : `${title} — ${NAME}`);
	const published_iso = $derived(published ? new Date(published).toISOString() : null);
</script>

<svelte:head>
	<title>{full_title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={url} />

	<meta property="og:type" content={type} />
	<meta property="og:site_name" content={NAME} />
	<meta property="og:title" content={full_title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={url} />
	<meta property="og:image" content={`${SITE}/og.png`} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={`${NAME} — portfolio`} />
	{#if published_iso}
		<meta property="article:published_time" content={published_iso} />
	{/if}

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@issssaaaaaaaaah" />
	<meta name="twitter:creator" content="@issssaaaaaaaaah" />
	<meta name="twitter:title" content={full_title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={`${SITE}/og.png`} />
</svelte:head>
