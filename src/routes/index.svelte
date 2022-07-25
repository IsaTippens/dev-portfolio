<script lang="ts" context="module">
	import LinkText from '$lib/components/LinkText.svelte';
	import { getYearsSince } from '$lib/getYear';
	export const load = async ({ fetch }) => {
		const age: Number = getYearsSince(new Date('2001-06-01'));
		const devYear: Number = getYearsSince(new Date('2013-08-01'));

		const res = await fetch(`/api/posts.json`);
		const posts = await res.json();
		return {
			props: {
				age,
				devYear,
				posts
			}
		};
	};
</script>

<script lang="ts">
	export let age: Number;
	export let devYear: Number;
	export let posts;
</script>

<div>
	<p class="text-3xl font-semibold">I'm Isa</p>
	<p class="text-3xl font-semibold">This is what I do</p>
	<br />
	<p>{age} y/o programmer of {devYear} years</p>
	<p>
		Current Final Year CS student from the <a
			href="https://uwc.ac.za"
			class="font-semibold hover:underline">University of the Western Cape</a
		>
	</p>
    <br/>
	<p>
		Made apps with React Native and Flutter, games with C and C#. A little web3 too. Currently
		learning Zig and Rust and many other cool tech.
	</p>
	<br />
	<div>
		<a href="/blog" class="text-2xl font-semibold">Blog</a>
		<ul class="list-disc">
			{#each posts.slice(0, 5) as post}
				<li>
					<LinkText url={'blog/' + post.path}>
						{post.meta.title}
					</LinkText>
				</li>
			{/each}
		</ul>
	</div>
	<br />
	<div>
		<p class="text-2xl font-semibold">Contact</p>
		<ul class="list-disc">
			<li>
				<LinkText url="mailto:isatippens2@gmail.com">Email</LinkText>
			</li>
			<li>
				<LinkText url="https://www.github.com/IsaTippens">Github</LinkText>
			</li>
		</ul>
	</div>
</div>
