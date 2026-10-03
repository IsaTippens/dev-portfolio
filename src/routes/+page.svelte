<script lang="ts">
	import About from '$lib/components/About.svelte';
	import Experience from '$lib/components/Experience.svelte';
	import Meta from '$lib/components/Meta.svelte';
	import SectionHeader from '$lib/components/SectionHeader.svelte';
	import NavButton from '$lib/components/NavButton.svelte';
	import GamingLog from '$lib/components/GamingLog.svelte';
	import Intro from '$lib/components/Intro.svelte';
	import PostTile from '$lib/components/PostTile.svelte';
	import Socials from '$lib/components/Socials.svelte';

	let { data } = $props();
</script>

<Meta title="Isa Tippens" description="I code things" path="/" />

<div class="grid gap-4">
	<!-- Front panel. -->
	<Intro />
	<About {data} />

	<Experience />

	<div class="my-6 grid grid-cols-2 gap-4 sm:grid-cols-4" data-boot="6">
		<NavButton href="/blog" prefix="F1_BLOG" title="Blog" subtitle="READABLES // NOTES" />
		<NavButton href="/projects" prefix="F2_PROJ" title="Projects" subtitle="SYSTEMS // CODE" />
		<NavButton href="/resume" target="_blank" prefix="F3_RESM" title="Resume" subtitle="DOWNLOAD // PDF" />
		<NavButton href="/gear" prefix="F4_GEAR" title="Gear" subtitle="HARDWARE // SETUP" />
	</div>

	<div>
		<SectionHeader title="Recent Posts" href="/blog" />
		<div class="grid">
			{#each (data.posts ?? []).slice(0, 5) as post (post.path)}
				<PostTile data={post} />
			{/each}
		</div>
	</div>

	<div>
		<SectionHeader title="Active Gaming Log" />
		<GamingLog />
	</div>

	<div>
		<SectionHeader title="Social Interfaces" />
		<Socials />
	</div>
</div>
