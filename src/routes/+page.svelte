<script context="module">
	import LinkText from '$lib/components/LinkText.svelte';

	import AnimatedHeader from '$lib/components/AnimatedHeader.svelte';
	export const load = async () => {};

	import { gsap } from "gsap";
	import { TextPlugin } from "gsap/dist/TextPlugin";
	gsap.registerPlugin(TextPlugin);

	import { onMount } from 'svelte';
</script>

<script>
	export let data;

	onMount(() => {
		const tl = gsap.timeline();
		const text_tl = gsap.timeline();
		const duration = 2;
		const delay = 2;

		text_tl.to('.gsap-info', {
			duration: duration,
			delay: delay,
			text: {
				value: 'developer',
				delimiter: ''
			}
		}).to('.gsap-info', {
			duration: duration,
			delay: delay,
			text: {
				value: 'coder',
				delimiter: ''
			}
		}).to('.gsap-info', {
			duration: duration,
			delay: delay,
			text: {
				value: 'programmer',
				delimiter: ''
			}
		}).repeat(-1);

		tl.from('.gsap-this', {
			duration,
			opacity: 0
		}).from(
			'.gsap-this',
			{
				duration,
				yPercent: 50,
				ease: 'bounce.out'
			},
			`-=${duration * 0.75}`
		);

		//GOOD:
		
	});
</script>

<svelte:head>
	<title>Isa Tippens</title>
	<meta name="description" content="I code things" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="canonical" href="https://isatippens.com" />
</svelte:head>

<div>
	<AnimatedHeader>
		<p class="text-3xl font-semibold text-white">I'm Isa</p>
		<p class="text-3xl font-semibold text-white">This is what I do</p>
	</AnimatedHeader>
	<br />
	<p>
		{data.age} y/o <span class="highlight-text gsap-info">programmer</span> of {data.devYear} years
	</p>
	<p>
		<span class="highlight-text">MSc Computer Science</span>
		student at the
		<a href="https://uwc.ac.za" class="highlight-link" target="_blank"
			>University of the Western Cape</a
		>
	</p>
	<br />
	<p class="gsap-this">
		Made apps with React Native and Flutter, games with C and C#. A little web3 too. Currently
		learning Zig and Rust and many other cool tech.
	</p>
	<br />

	<div>
		<AnimatedHeader>
			<a href="/blog" class="text-3xl font-semibold text-white">Posts</a>
		</AnimatedHeader>
		<br />
		<ul class="list-bullets">
			{#each data.posts.slice(0, 5) as post}
				<li>
					<LinkText url={'blog/' + post.path} open_tab={false}>
						{post.meta.title}
					</LinkText>
				</li>
			{/each}
		</ul>
	</div>
	<br />
	<div>
		<AnimatedHeader>
			<span class="text-3xl font-semibold text-white">Socials</span>
		</AnimatedHeader>
		<br />
		<ul class="list-bullets">
			<li>
				<LinkText url="mailto:isatippens2@gmail.com" open_tab={false}>Email</LinkText>
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
