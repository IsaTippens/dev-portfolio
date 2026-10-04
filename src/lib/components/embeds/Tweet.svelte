<script module lang="ts">
	type Twttr = {
		ready: (callback: (twttr: Twttr) => void) => void;
		events: { bind: (name: 'rendered', callback: (event: { target: HTMLElement }) => void) => void };
		widgets: { load: (root?: Element) => void };
	};

	/** One widgets.js per page, kept for the whole visit and shared by every Tweet. */
	let widgets: Promise<Twttr> | null = null;

	function loadWidgets(): Promise<Twttr> {
		widgets ??= new Promise<Twttr>((resolve, reject) => {
			const script = document.createElement('script');
			script.src = 'https://platform.twitter.com/widgets.js';
			script.async = true;
			script.onload = () => {
				// widgets.js publishes `window.twttr`; lib.dom has no type for it, so `Twttr` is asserted.
				const twttr = 'twttr' in window ? (window.twttr as Twttr | undefined) : undefined;
				if (twttr) twttr.ready(resolve);
				else reject(new Error('widgets.js loaded without window.twttr'));
			};
			script.onerror = () => reject(new Error('widgets.js failed to load'));
			document.head.appendChild(script);
		}).catch((error) => {
			widgets = null; // the next Tweet may try again
			throw error;
		});
		return widgets;
	}
</script>

<script lang="ts">
	let { tweetLink = '' } = $props<{ tweetLink?: string }>();
	let isLoaded = $state(false);
	let root: HTMLDivElement;

	$effect(() => {
		let live = true;
		let fallback: ReturnType<typeof setTimeout> | undefined;
		// Third-party script only as the reader approaches the tweet.
		const near = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;
				near.disconnect();
				// Fallback: a blocked or failed script still shows the plain link after 6s.
				fallback = setTimeout(() => (isLoaded = true), 6000);
				loadWidgets().then(
					(twttr) => {
						if (!live) return;
						twttr.events.bind('rendered', (event) => {
							if (live && event.target && root.contains(event.target)) {
								clearTimeout(fallback);
								isLoaded = true;
							}
						});
						twttr.widgets.load(root);
					},
					() => {}
				);
			},
			{ rootMargin: '600px' }
		);
		near.observe(root);
		return () => {
			live = false;
			near.disconnect();
			clearTimeout(fallback);
		};
	});
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
		color: var(--accent);
	}

	.spinner {
		width: 18px;
		height: 18px;
		border: 1px solid currentColor;
		border-top-color: transparent;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
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
