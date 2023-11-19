<script>
	import Divider from '$lib/components/Divider.svelte';
	export let data;
	let posts = data.posts;
</script>

<svelte:head>
	<title>Blog</title>
	<meta name="description" content="Interesting Readables" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="canonical" href="https://isatippens.com/blog" />
</svelte:head>
<div class="py-8 px-4 gradient-card-bg rounded-lg text-white">
	<div>
		<span class="font-semibold text-white"
			><a href="/" class="text-white">Home</a> / <span class="crumb-end text-white">Blog</span></span
		>
	</div>
	<div class="sticky top-0 z-10">
		<p class="text-3xl semibold text-white">Stuff I Wrote</p>
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
