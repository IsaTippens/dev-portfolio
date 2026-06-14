<script>
	import { onMount } from 'svelte';

	let { data } = $props();

	onMount(() => {});
</script>

<div class="grid gap-6">
	<!-- Location and Bio Overview Panel -->
	<div class="border border-black dark:border-neutral-700 p-3 bg-neutral-100 dark:bg-neutral-900/40 relative">
		<div class="absolute top-0 right-3 -translate-y-1/2 bg-[#f4f4f2] dark:bg-[#1c1c1c] px-2 text-[8px] uppercase tracking-widest text-accent font-mono">
			[BIO_DATA]
		</div>
		<div class="text-[11px] leading-relaxed font-mono">
			<span class="text-accent">LOCATION:</span> Cape Town, South Africa <br/>
			<span class="text-accent">STATUS:</span> {data.age} y/o programmer ({data.devYear} yrs code) <br/>
			<span class="text-accent">EXPERIENCE:</span> software engineer for {data.seYear} years <br/>
			<span class="text-accent">VIBE_CHECK:</span> vibe coder for {data.vibeYear} year
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
