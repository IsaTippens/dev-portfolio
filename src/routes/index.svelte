<script context="module">
	import LinkText from '$lib/components/LinkText.svelte';
	import { getYearsSince } from '$lib/getYear';
	export const load = async ({fetch}) => {
		const age = getYearsSince(new Date('2001-06-01'));
		const devYear = getYearsSince(new Date('2013-08-01'));

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
	<p class="text-3xl font-semibold">I'm <span class="highlight-text">Isa</span></p>
	<p class="text-3xl font-semibold">This is <span class="highlight-text">what I do</span></p>
	<br />
	<p>{age} y/o <span class="highlight-text">programmer</span> of {devYear} years</p>
	<p>
		Computer Science graduate from the <a
			href="https://uwc.ac.za"
			class="highlight-link">University of the Western Cape</a
		>
	</p>
    <br/>
	<p>
		Made apps with React Native and Flutter, games with C and C#. A little web3 too. Currently
		learning Zig and Rust and many other cool tech.
	</p>
	<br />
	<div>
		<a href="/blog" class="text-2xl font-semibold highlight-text">Blog</a>
		<ul class="list-bullets">
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
		<span class="text-2xl font-semibold highlight-text">Socials</span>
		<ul class="list-bullets">
			<li>
				<LinkText url="mailto:isatippens2@gmail.com">Email</LinkText>
			</li>
			<li>
				<LinkText url="https://www.github.com/IsaTippens">Github</LinkText>
			</li>
            <li>
				<LinkText url="https://twitter.com/issssaaaaaaaaah">Twitter</LinkText>
			</li>
            <li>
				<LinkText url="https://www.instagram.com/issssaaaaaaaaaaaaaahhhhhhhhhhh/">Instagram</LinkText>
			</li>
            <li>
				<LinkText url="https://www.youtube.com/@issaaahhhh">Youtube</LinkText>
			</li>
		</ul>
	</div>
</div>
