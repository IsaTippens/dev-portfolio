<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	let { tweetLink = '' } = $props<{ tweetLink?: string }>();
	let twitter_widgets_script: HTMLScriptElement | null = null;
	let isLoaded = $state(false);
	let root: HTMLDivElement;

	const load_twitter_widgets_script = () => {
		if (twitter_widgets_script) return;
		twitter_widgets_script = document.createElement('script');
		twitter_widgets_script.src = 'https://platform.twitter.com/widgets.js';
		twitter_widgets_script.async = true;
		document.head.appendChild(twitter_widgets_script);

		// Check window.twttr
		const checkTwttr = setInterval(() => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			if ((window as any).twttr) {
				clearInterval(checkTwttr);
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				(window as any).twttr.ready((twttr: { events: { bind: (name: string, cb: (e: { target: HTMLElement }) => void) => void } }) => {
					twttr.events.bind('rendered', (event: { target: HTMLElement }) => {
						if (event.target && root.contains(event.target)) {
							isLoaded = true;
						}
					});
				});
			}
		}, 100);

		// Fallback timeout to hide spinner if script fails or is blocked
		setTimeout(() => {
			isLoaded = true;
			clearInterval(checkTwttr);
		}, 6000);
	};

	const remove_twitter_widget_script = () => {
		if (twitter_widgets_script) {
			document.head.removeChild(twitter_widgets_script);
			twitter_widgets_script = null;
		}
	};
	onMount(load_twitter_widgets_script);
	onDestroy(remove_twitter_widget_script);
</script>

<div class="tweet-wrapper" bind:this={root}>
	{#if !isLoaded}
		<div class="spinner-container">
			<div class="spinner"></div>
			<span class="loading-text">LOADING TWEET...</span>
		</div>
	{/if}
	<blockquote class="twitter-tweet" class:hidden={!isLoaded}>
		<a href={`https://twitter.com/${tweetLink}`}>Twitter Link</a>
	</blockquote>
</div>

<style>
	.tweet-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-bottom: 12px;
		min-height: 120px;
		width: 100%;
	}

	.hidden {
		display: none !important;
	}

	.spinner-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		font-family: monospace;
		font-size: 8px;
		letter-spacing: 0.15em;
		color: var(--accent-color);
	}

	.spinner {
		width: 18px;
		height: 18px;
		border: 1px solid currentColor;
		border-top-color: transparent;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	.loading-text {
		color: var(--accent-color);
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.twitter-tweet {
		display: block;
		margin: 0;
		padding: 0;
		width: 100%;
		max-width: 550px;
	}

	.twitter-tweet a {
		display: none; /* Hide raw link since spinner is shown */
	}
</style>
