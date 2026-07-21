<script lang="ts">
	// Clean, minimal tech portrait photo component
</script>

<div class="relative w-full aspect-square rounded-lg overflow-hidden border border-border bg-card shadow-sm group select-none flex flex-col justify-end">
	<!-- Profile photo image -->
	<img
		src="/images/profile-instagram.jpg"
		alt="Isa Tippens"
		class="absolute inset-0 w-full h-full object-cover object-center grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
		loading="eager"
	/>

	<!-- Minimal ambient gradient overlay -->
	<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>

	<!-- Corner tech crosshair accents -->
	<div class="absolute top-2 left-2 text-[10px] font-mono text-white/70 tracking-tighter pointer-events-none">
		+
	</div>
	<div class="absolute top-2 right-2 text-[10px] font-mono text-white/70 tracking-tighter pointer-events-none">
		+
	</div>

	<!-- Tech metadata badge overlay -->
	<div class="relative z-10 p-3 flex items-center justify-between font-mono text-tiny text-white/90">
		<div class="flex items-center gap-1.5">
			<span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
			<span class="font-bold tracking-wider uppercase">ISA.TIPPENS</span>
		</div>
		<span class="text-white/60 text-[9px]">CPT_ZA</span>
	</div>
</div>
