<script>
	import Divider from '$lib/components/Divider.svelte';
	import AnimatedHeader from '$lib/components/AnimatedHeader.svelte';
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
		<div class="card">
			<div class="card-inner">
				<a href={'blog/' + post.path}>
					<div class="flex flex-col sm:flex-row">
						<div class="flex-auto text-lg">
							{post.meta.title}
						</div>
						<div>
							{new Date(post.meta.date).toDateString()}
						</div>
					</div>
					<div>
						{post.meta.description}
					</div>
				</a>
			</div>
		</div>
		{#if i < posts.length - 1}
			<Divider />
		{/if}
	{/each}
</main>
