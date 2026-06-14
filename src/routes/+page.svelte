<script>
	import About from '$lib/components/About.svelte';
	import { gsap } from 'gsap';
	import { TextPlugin } from 'gsap/dist/TextPlugin';
	gsap.registerPlugin(TextPlugin);

	import { onMount } from 'svelte';

	import RightArrow from 'virtual:icons/mingcute/right-fill.svelte';
	import Intro from '$lib/components/Intro.svelte';
	import PostTile from '$lib/components/PostTile.svelte';
	import Socials from '$lib/components/Socials.svelte';

	let { data } = $props();

	onMount(() => {});
</script>

<svelte:head>
	<title>Isa Tippens</title>
	<meta name="description" content="I code things" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="canonical" href="https://isatippens.com" />
</svelte:head>

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
		<a href="/blog" class="flex flex-col border border-black dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900/60 hover:border-accent hover:bg-accent/5 transition-all p-3 rounded-none">
			<span class="text-[8px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">[F1_BLOG]</span>
			<span class="text-base font-bold text-black dark:text-white mt-1 uppercase">Blog</span>
			<span class="text-[9px] text-neutral-500 dark:text-neutral-400 mt-1 uppercase">READABLES // NOTES</span>
		</a>
		<a href="/projects" class="flex flex-col border border-black dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900/60 hover:border-accent hover:bg-accent/5 transition-all p-3 rounded-none">
			<span class="text-[8px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">[F2_PROJ]</span>
			<span class="text-base font-bold text-black dark:text-white mt-1 uppercase">Projects</span>
			<span class="text-[9px] text-neutral-500 dark:text-neutral-400 mt-1 uppercase">SYSTEMS // CODE</span>
		</a>
		<a href="/resume" target="_blank" class="flex flex-col border border-black dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900/60 hover:border-accent hover:bg-accent/5 transition-all p-3 rounded-none">
			<span class="text-[8px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">[F3_RESM]</span>
			<span class="text-base font-bold text-black dark:text-white mt-1 uppercase">Resume</span>
			<span class="text-[9px] text-neutral-500 dark:text-neutral-400 mt-1 uppercase">DOWNLOAD // PDF</span>
		</a>
		<a href="/gear" class="flex flex-col border border-black dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900/60 hover:border-accent hover:bg-accent/5 transition-all p-3 rounded-none">
			<span class="text-[8px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">[F4_GEAR]</span>
			<span class="text-base font-bold text-black dark:text-white mt-1 uppercase">Gear</span>
			<span class="text-[9px] text-neutral-500 dark:text-neutral-400 mt-1 uppercase">HARDWARE // SETUP</span>
		</a>
	</div>
	<a href="/blog" class="block border-t border-b border-black dark:border-neutral-700 py-3 my-4 group hover:border-accent transition-colors">
		<div class="flex justify-between items-center">
			<div class="flex items-center gap-2">
				<span class="inline-block w-2 h-2 bg-accent"></span>
				<p class="text-xl font-bold uppercase tracking-tight text-black dark:text-white group-hover:text-accent transition-colors">Recent Posts</p>
			</div>
			<div class="flex items-center gap-1 text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase">
				<span>View all</span>
				<RightArrow class="w-4 h-4 text-accent" />
			</div>
		</div>
	</a>
	<div class="grid">
		{#each data.posts.slice(0, 5) as post}
			<PostTile data={post} />
		{/each}
	</div>

	<!-- Gaming Log Section -->
	<div class="block border-t border-b border-black dark:border-neutral-700 py-3 my-4">
		<div class="flex items-center gap-2">
			<span class="inline-block w-2 h-2 bg-accent"></span>
			<p class="text-xl font-bold uppercase tracking-tight text-black dark:text-white">Active Gaming Log</p>
		</div>
	</div>

	<div class="border border-black dark:border-neutral-700 overflow-x-auto rounded-none my-4 bg-transparent">
		<table class="w-full text-left font-mono text-xs border-collapse">
			<thead>
				<tr class="bg-neutral-200/50 dark:bg-neutral-800/50 border-b border-black dark:border-neutral-700">
					<th class="p-2 uppercase font-bold text-black dark:text-white text-[10px] tracking-wider border-r border-black dark:border-neutral-700">Game Title</th>
					<th class="p-2 uppercase font-bold text-black dark:text-white text-[10px] tracking-wider border-r border-black dark:border-neutral-700">Stats / Mode</th>
					<th class="p-2 uppercase font-bold text-black dark:text-white text-[10px] tracking-wider">Platform</th>
				</tr>
			</thead>
			<tbody>
				<tr class="border-b border-black dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-900/30">
					<td class="p-2 border-r border-black dark:border-neutral-700 font-bold uppercase text-black dark:text-white">Valorant</td>
					<td class="p-2 border-r border-black dark:border-neutral-700 text-neutral-500 dark:text-neutral-400">PEAK PLATINUM 3</td>
					<td class="p-2 text-neutral-500 dark:text-neutral-400">PC (RIOT)</td>
				</tr>
				<tr class="border-b border-black dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-900/30">
					<td class="p-2 border-r border-black dark:border-neutral-700 font-bold uppercase text-black dark:text-white">Geometry Dash</td>
					<td class="p-2 border-r border-black dark:border-neutral-700 text-neutral-500 dark:text-neutral-400">12 DEMONS COMPLETED</td>
					<td class="p-2 text-neutral-500 dark:text-neutral-400">PC (STEAM)</td>
				</tr>
				<tr class="border-b border-black dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-900/30">
					<td class="p-2 border-r border-black dark:border-neutral-700 font-bold uppercase text-black dark:text-white">Fortnite</td>
					<td class="p-2 border-r border-black dark:border-neutral-700 text-neutral-500 dark:text-neutral-400">ZERO BUILD MODE</td>
					<td class="p-2 text-neutral-500 dark:text-neutral-400">PC (EPIC)</td>
				</tr>
				<tr class="border-b border-black dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-900/30">
					<td class="p-2 border-r border-black dark:border-neutral-700 font-bold uppercase text-black dark:text-white">No Man's Sky</td>
					<td class="p-2 border-r border-black dark:border-neutral-700 text-neutral-500 dark:text-neutral-400">SINGLE PLAYER</td>
					<td class="p-2 text-neutral-500 dark:text-neutral-400">PC (STEAM)</td>
				</tr>
				<tr class="hover:bg-neutral-100 dark:hover:bg-neutral-900/30">
					<td class="p-2 border-r border-black dark:border-neutral-700 font-bold uppercase text-black dark:text-white">Into the Dead: ODD</td>
					<td class="p-2 border-r border-black dark:border-neutral-700 text-neutral-500 dark:text-neutral-400">SINGLE PLAYER</td>
					<td class="p-2 text-neutral-500 dark:text-neutral-400">PC (STEAM)</td>
				</tr>
			</tbody>
		</table>
	</div>

	<div class="p-4">
		<Socials />
	</div>
</div>
