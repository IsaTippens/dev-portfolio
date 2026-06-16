<script lang="ts">
	import { onMount } from 'svelte';
	import ProfilePhoto from '$lib/components/ProfilePhoto.svelte';

	let { data } = $props<{ data: any }>();

	const penguin = [
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0],
		[0, 0, 0, 3, 3, 3, 5, 3, 3, 5, 3, 3, 3, 0, 0, 0],
		[0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0],
		[0, 0, 0, 3, 3, 3, 4, 4, 4, 4, 3, 3, 3, 0, 0, 0],
		[0, 0, 0, 3, 3, 5, 5, 5, 5, 5, 5, 3, 3, 0, 0, 0],
		[0, 0, 3, 3, 5, 5, 5, 5, 5, 5, 5, 5, 3, 3, 0, 0],
		[0, 0, 3, 3, 5, 5, 5, 5, 5, 5, 5, 5, 3, 3, 0, 0],
		[0, 3, 3, 3, 5, 5, 5, 5, 5, 5, 5, 5, 3, 3, 3, 0],
		[3, 3, 3, 3, 5, 5, 5, 5, 5, 5, 5, 5, 3, 3, 3, 3],
		[3, 3, 3, 3, 3, 5, 5, 5, 5, 5, 5, 3, 3, 3, 3, 3],
		[0, 3, 3, 3, 3, 3, 5, 5, 5, 5, 3, 3, 3, 3, 3, 0],
		[0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0],
		[0, 0, 0, 0, 4, 4, 4, 0, 0, 4, 4, 4, 0, 0, 0, 0]
	];

	const spaceship = [
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 7, 7, 7],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 7, 7, 7, 7],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 7, 7, 7],
		[0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 8, 8, 5, 5, 7, 7],
		[0, 0, 0, 0, 0, 0, 0, 5, 5, 8, 8, 8, 8, 5, 5, 7],
		[0, 7, 7, 7, 7, 7, 5, 5, 8, 8, 8, 8, 8, 5, 5, 0],
		[0, 7, 7, 7, 7, 5, 5, 5, 8, 8, 8, 8, 5, 5, 0, 0],
		[0, 0, 7, 7, 5, 5, 5, 5, 5, 8, 8, 5, 5, 0, 0, 0],
		[0, 0, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0],
		[0, 0, 0, 4, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0],
		[0, 0, 4, 4, 4, 5, 5, 5, 5, 5, 7, 0, 0, 0, 0, 0],
		[0, 0, 4, 4, 4, 4, 5, 5, 5, 7, 7, 0, 0, 0, 0, 0],
		[0, 0, 4, 4, 4, 4, 4, 5, 7, 7, 7, 0, 0, 0, 0, 0],
		[0, 0, 0, 4, 4, 4, 0, 0, 7, 7, 7, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	];

	interface Artwork {
		name: string;
		matrix: number[][];
	}

	const emojiArtworks: Artwork[] = [
		{ name: 'penguin', matrix: penguin },
		{ name: 'spaceship', matrix: spaceship }
	];

	let selectedArtwork = $state<Artwork | null>(null);

	onMount(() => {
		const randomIndex = Math.floor(Math.random() * emojiArtworks.length);
		selectedArtwork = emojiArtworks[randomIndex];
	});
</script>

<div class="grid gap-6">
	<!-- Location, Bio Overview and Photo Panel -->
	<div class="flex flex-col md:flex-row gap-6">
		<div class="border border-black dark:border-neutral-700 p-3 bg-neutral-100 dark:bg-neutral-900/40 relative flex-1">
			<div class="absolute top-0 right-3 -translate-y-1/2 bg-[#f4f4f2] dark:bg-[#1c1c1c] px-2 text-[8px] uppercase tracking-widest text-accent font-mono">
				[BIO_DATA]
			</div>
			<div class="text-[11px] leading-relaxed font-mono">
				<span class="text-accent">LOCATION:</span> Cape Town, South Africa <br/>
				<span class="text-accent">STATUS:</span> {data.age} y/o programmer ({data.devYear} yrs code) <br/>
				<span class="text-accent">EXPERIENCE:</span> software engineer for {data.seYear} years <br/>
				<span class="text-accent">VIBE_CHECK:</span> vibe coder for {data.vibeYear} year
			</div>

			<!-- Random Dot Art Emoji (Cowboy, Penguin, Spaceship) -->
			{#if selectedArtwork}
				<div class="absolute bottom-3 right-3 hidden md:block z-10">
					<div class="flex flex-col items-end gap-1">
						<!-- Matrix Grid -->
						<div class="grid gap-0.5 p-1 bg-neutral-200/50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700/60 rounded-none shadow-[1px_1px_0px_rgba(0,0,0,0.15)] dark:shadow-none" style="grid-template-columns: repeat(16, minmax(0, 1fr));">
							{#each selectedArtwork.matrix as row}
								{#each row as cell}
									<div 
										class="w-2 h-2 rounded-full transition-colors duration-300 {
											cell === 0 ? 'bg-neutral-300 dark:bg-neutral-900 opacity-25' :
											cell === 1 ? 'bg-[#ffd43b]' :
											cell === 2 ? 'bg-[#a0522d]' :
											cell === 3 ? 'bg-neutral-900 dark:bg-black' :
											cell === 4 ? 'bg-[#ff5500]' :
											cell === 5 ? 'bg-neutral-100 dark:bg-white' :
											cell === 7 ? 'bg-[#e03131]' :
											cell === 8 ? 'bg-[#1c7ed6]' : ''
										}"
									></div>
								{/each}
							{/each}
						</div>
						<!-- Small label under the dot art, matching TE style -->
						<span class="text-[5px] text-neutral-400 dark:text-neutral-500 font-mono tracking-widest uppercase select-none">
							SYS_GRP: {selectedArtwork.name}_art.bin
						</span>
					</div>
				</div>
			{/if}
		</div>
		<!-- Profile Photo Section -->
		<div class="w-full max-w-[220px] mx-auto md:max-w-none md:w-48 shrink-0 flex items-center justify-center">
			<ProfilePhoto />
		</div>
	</div>
	<!-- CTO Compartment -->
	<div class="border border-black dark:border-neutral-700 p-4 relative">
		<div class="absolute top-0 left-4 -translate-y-1/2 bg-[#f4f4f2] dark:bg-[#1c1c1c] px-2 text-[9px] uppercase tracking-widest text-neutral-500 dark:text-neutral-400 font-mono">
			01 / CHIEF_TECH_OFFICER
		</div>
		<div class="text-xs leading-relaxed mt-1 text-justify">
			<span class="font-bold text-black dark:text-white uppercase">Alphacrest</span>: Directing technical strategy and execution, managing scalable AWS cloud infrastructure, developing and optimizing low-latency algorithmic trading systems, and engineering critical internal developer tooling.
		</div>
	</div>

	<!-- MSc Candidate Compartment -->
	<div class="border border-black dark:border-neutral-700 p-4 relative">
		<div class="absolute top-0 left-4 -translate-y-1/2 bg-[#f4f4f2] dark:bg-[#1c1c1c] px-2 text-[9px] uppercase tracking-widest text-neutral-500 dark:text-neutral-400 font-mono">
			02 / MSC_CS_CANDIDATE
		</div>
		<div class="text-xs leading-relaxed mt-1 text-justify">
			<span class="font-bold text-black dark:text-white uppercase">Thesis</span>: "A framework for secure financial transactions using relativistic quantum tokens", combining quantum computing and software engineering to develop next-generation secure transaction protocols. Currently in the final year of an MSc in Computer Science at the University of the Western Cape.
		</div>
	</div>

	<!-- Cybersecurity & SANReN Compartment -->
	<div class="border border-black dark:border-neutral-700 p-4 relative">
		<div class="absolute top-0 left-4 -translate-y-1/2 bg-[#f4f4f2] dark:bg-[#1c1c1c] px-2 text-[9px] uppercase tracking-widest text-neutral-500 dark:text-neutral-400 font-mono">
			03 / CYBERSECURITY_UWC
		</div>
		<div class="text-xs leading-relaxed mt-1 text-justify">
			Currently mentoring cybersecurity teams at UWC (2024, 2026). Represented UWC as a SANReN finalist in 2023, and secured 1st place in 2025.
		</div>
	</div>
</div>
