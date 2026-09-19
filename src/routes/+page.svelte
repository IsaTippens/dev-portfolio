<script lang="ts">
	import { onMount } from 'svelte';

	import About from '$lib/components/About.svelte';
	import Experience from '$lib/components/Experience.svelte';
	import Meta from '$lib/components/Meta.svelte';
	import SectionHeader from '$lib/components/SectionHeader.svelte';
	import NavButton from '$lib/components/NavButton.svelte';
	import GamingLog from '$lib/components/GamingLog.svelte';
	import Intro from '$lib/components/Intro.svelte';
	import PostTile from '$lib/components/PostTile.svelte';
	import Socials from '$lib/components/Socials.svelte';
	import { onScrollProgress } from '$lib/motion/scrub.js';

	let { data } = $props();

	/**
	 * The hero pins for 150vh of travel and the portrait engine walks its five display
	 * modes across that distance — a mode per 30vh, with the keys lighting up as if the
	 * operator pressed them. Sticky positioning, never scroll-jacking; no pin at all on
	 * small screens or under reduced motion, where the hero is just a section.
	 */
	const PO_MODES = ['LCD', 'CRT', 'GAMEBOY', 'DOT_MATRIX', 'NORMAL'] as const;

	let track: HTMLElement | null = $state(null);
	let po_mode = $state<(typeof PO_MODES)[number] | null>(null);

	onMount(() => {
		if (!track) return;
		if (!window.matchMedia('(min-width: 768px) and (min-height: 720px)').matches) return;

		return onScrollProgress(track, (progress) => {
			const step = Math.min(PO_MODES.length - 1, Math.floor(progress * PO_MODES.length));
			const next = PO_MODES[step];
			if (next !== po_mode) po_mode = next;
		});
	});
</script>

<Meta title="Isa Tippens" description="I code things" path="/" />

<div class="grid gap-4">
	<!-- Front panel. Pinned on desktop, in normal flow everywhere else. -->
	<div class="hero-track" data-pin-track bind:this={track}>
		<div class="hero-stick">
			<Intro />
			<About {data} scroll_mode={po_mode} />
		</div>
	</div>

	<Experience />

	<div class="my-6 grid grid-cols-2 gap-4 sm:grid-cols-4" data-boot="6">
		<NavButton href="/blog" prefix="F1_BLOG" title="Blog" subtitle="READABLES // NOTES" />
		<NavButton href="/projects" prefix="F2_PROJ" title="Projects" subtitle="SYSTEMS // CODE" />
		<NavButton href="/resume" target="_blank" prefix="F3_RESM" title="Resume" subtitle="DOWNLOAD // PDF" />
		<NavButton href="/gear" prefix="F4_GEAR" title="Gear" subtitle="HARDWARE // SETUP" />
	</div>

	<!-- Recent posts: the light version of a seat — rows only, no frame to stroke on. -->
	<div data-seat>
		<SectionHeader title="Recent Posts" href="/blog" />
		<div class="grid">
			{#each (data.posts ?? []).slice(0, 5) as post (post.path)}
				<PostTile data={post} />
			{/each}
		</div>
	</div>

	<div data-seat>
		<SectionHeader title="Active Gaming Log" />
		<GamingLog />
	</div>

	<div data-seat>
		<SectionHeader title="Social Interfaces" />
		<Socials />
	</div>
</div>

<style>
	/*
		The pin. 250vh of track gives 150vh of pinned travel after the first viewport; the
		hero only pins where there is room for it to be a screen rather than a column.
	*/
	.hero-track {
		position: relative;
	}

	.hero-stick {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	@media (min-width: 768px) and (min-height: 720px) {
		.hero-track {
			height: 250vh;
		}

		.hero-stick {
			position: sticky;
			top: 0;
			min-height: 100vh;
			justify-content: flex-start;
			padding-top: 1rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.hero-track {
			height: auto;
		}

		.hero-stick {
			position: static;
			min-height: 0;
			padding-top: 0;
		}
	}
</style>
