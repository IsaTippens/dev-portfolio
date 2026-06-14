<script lang="ts">
	let {
		spotifyLink = '',
		width = '100%',
		height = '80px',
	} = $props<{
		spotifyLink?: string;
		width?: string;
		height?: string;
	}>();

	let iframe_styles = $derived(`
		border-radius: 0.8rem;
		height: ${height};
		width: ${width};
	`);
</script>

<div class="my-2">
<iframe
	data-testid="spotify"
	title={`spotify-${spotifyLink}`}
	class="spotify-sveltekit-embed"
	src={`https://open.spotify.com/embed/${spotifyLink}`}
	frameBorder="0"
	allow="encrypted-media"
	style={iframe_styles}
></iframe>
</div>
