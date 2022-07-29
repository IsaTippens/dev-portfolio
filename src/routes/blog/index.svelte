<script context="module">
	import { dev } from '$app/env';
	export const load = async ({ fetch }) => {
		const posts = await fetch(`/api/posts.json`);
		let allPosts = await posts.json();
	
		return {
			props: {
				posts: allPosts
			}
		};
	};
</script>

<script>
	import Divider from '$lib/components/Divider.svelte';
	export let posts;
</script>

<div>
	<p class="text-3xl semibold">Stuff I Wrote</p>
</div>
<br/>
<ul>
	{#each posts as post}
		<li class="shadow-md p-4">
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
		</li>
	{/each}
</ul>
<br/>
<div><a href="/" class="text-xl">Back to home</a></div>
