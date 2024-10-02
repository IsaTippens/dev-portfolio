<script>
	import Divider from '$lib/components/Divider.svelte';
	import AnimatedHeader from '$lib/components/AnimatedHeader.svelte';
	import PostTile from '$lib/components/PostTile.svelte';
	export let data;
	let posts = data.posts;
</script>

<svelte:head>
	<title>Posts</title>
	<meta name="description" content="Interesting Readables" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="canonical" href="https://isatippens.com/blog" />
</svelte:head>
<div>
	<div>
		<span class="font-semibold"
			><a href="/" class="">Home</a> /
			<span class="crumb-end">Posts</span></span
		>
	</div>
	<div class="sticky top-0 z-10">
		<p class="text-3xl semibold">Stuff I Wrote</p>
	</div>
</div>
<main>
	{#each posts as post, i}
		<PostTile data={post} />
	{/each}
</main>
