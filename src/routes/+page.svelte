<script>
	import About from '$lib/components/About.svelte';

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
	<div class="grid gap-2">
		<div>
			<Intro />
		</div>
		<div>
			<About {data} />
		</div>
	</div>
	<div class="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
		<NavButton href="/blog" prefix="F1_BLOG" title="Blog" subtitle="READABLES // NOTES" />
		<NavButton href="/projects" prefix="F2_PROJ" title="Projects" subtitle="SYSTEMS // CODE" />
		<NavButton
			href="/resume"
			target="_blank"
			prefix="F3_RESM"
			title="Resume"
			subtitle="DOWNLOAD // PDF"
		/>
		<NavButton href="/gear" prefix="F4_GEAR" title="Gear" subtitle="HARDWARE // SETUP" />
	</div>
	<SectionHeader title="Recent Posts" href="/blog" />
	<div class="grid">
		{#each (data.posts ?? []).slice(0, 5) as post}
			<PostTile data={post} />
		{/each}
	</div>

	<!-- Gaming Log Section -->
	<SectionHeader title="Active Gaming Log" />
	<GamingLog />

	<!-- Social Interfaces Section -->
	<SectionHeader title="Social Interfaces" />

	<div class="p-4">
		<Socials />
	</div>
</div>
