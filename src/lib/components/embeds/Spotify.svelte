<script lang="ts">
	let {
		spotifyLink = '',
		width = '100%',
		height = '80px',
	}: {
		spotifyLink?: string;
		width?: string;
		height?: string;
	} = $props();

	let iframe_styles = $derived(`
		border-radius: var(--radius);
		border: var(--stroke) solid var(--line);
		height: ${height};
		width: ${width};
	`);
</script>

<div class="my-2">
<iframe
	title={`spotify-${spotifyLink}`}
	loading="lazy"
	src={`https://open.spotify.com/embed/${spotifyLink}`}
	frameBorder="0"
	allow="encrypted-media"
	style={iframe_styles}
></iframe>
</div>
