<script>
	import { onMount } from 'svelte';

	let { data } = $props();

	onMount(() => {});
</script>

<div class="grid gap-4">
	<div class="text-lg">
		<p>Cape Town, South Africa • {data.age} y/o programmer for {data.devYear} years • software engineer for {data.seYear} years • vibe coder for {data.vibeYear} year</p>
	</div>

	<p class="text-3xl font-semibold">Chief Technology Officer</p>
	<div class="">
		<p>Chief Technology Officer at Alphacrest. Directing technical strategy and execution, managing scalable AWS cloud infrastructure, developing and optimizing low-latency algorithmic trading systems, and engineering critical internal developer tooling.</p>
	</div>

	<p class="text-3xl font-semibold">MSc Computer Science Candidate</p>
	<div>
		<p>Currently in the final year of an MSc in Computer Science at the University of the Western Cape. Research thesis titled 'A framework for secure financial transactions using relativistic quantum tokens', combining quantum computing and software engineering to develop next-generation secure transaction protocols.</p>
	</div>
</div>
