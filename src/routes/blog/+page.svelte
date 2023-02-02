<script>
	import Divider from '$lib/components/Divider.svelte';
	export let data;
	let posts = data.posts;
</script>

<svelte:head>
	<title>Blog</title>
	<meta name="description" content="Interesting Readables" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>
<div>
	<span class="font-semibold highlight-text"
		><a href="/" class="highlight-text">Home</a> / <span class="crumb-end">Blog</span></span
	>
</div>
<div class="sticky top-0 z-10 blog-header">
	<p class="text-3xl semibold">Stuff I <span class="highlight-text">Wrote</span></p>
</div>
<main>
	<ul>
		{#each posts as post}
			<li class="card">
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
			</li>
		{/each}
	</ul>
</main>
