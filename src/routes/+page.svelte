<script context="module">
	import LinkText from '$lib/components/LinkText.svelte';

	export const load = async () => {};
</script>

<script>
	export let data;
</script>

<svelte:head>
	<title>Isa Tippens</title>
	<meta name="description" content="I code things" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="canonical" href="https://isatippens.com" />
</svelte:head>

<div>
	<p class="text-3xl font-semibold">I'm <span class="highlight-text">Isa</span></p>
	<p class="text-3xl font-semibold">This is <span class="highlight-text">what I do</span></p>
	<br />
	<p>{data.age} y/o <span class="highlight-text">programmer</span> of {data.devYear} years</p>
	<p>
		<a href="https://sites.google.com/myuwc.ac.za/quantum-money/home" class="highlight-link"
			>Computer Science Honours</a
		>
		student from the
		<a href="https://uwc.ac.za" class="highlight-link">University of the Western Cape</a>
	</p>
	<br />
	<p>
		Made apps with React Native and Flutter, games with C and C#. A little web3 too. Currently
		learning Zig and Rust and many other cool tech.
	</p>
	<br />

	<div>
		<a href="/blog" class="text-2xl font-semibold highlight-text">Blog</a>
		<ul class="list-bullets">
			{#each data.posts.slice(0, 5) as post}
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
		<a href="/" class="text-2xl font-semibold highlight-text">Socials</a>
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
				<LinkText url="https://www.instagram.com/issssaaaaaaaaaaaaaahhhhhhhhhhh/"
					>Instagram</LinkText
				>
			</li>
			<li>
				<LinkText url="https://www.youtube.com/@issaaahhhh">Youtube</LinkText>
			</li>
		</ul>
	</div>
</div>
