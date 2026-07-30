<script lang="ts">
	import NothingPhone from '$lib/components/NothingPhone.svelte';

	// Control states
	let width = $state(220);
	let active = $state(true);
	let showGrid = $state(true);

	// Color states
	let bodyColor = $state('#f4f4f4');
	let strokeColor = $state('#d1d5db');
	let cameraBumpColor = $state('#e5e7eb');
	let cableColor = $state('#d1d5db');
	let glyphColor = $state('#ffffff');
	let glyphActiveColor = $state('#ffffff');

	// Background state
	let bgTheme = $state('dark-grid');

	// Presets
	const presets = {
		white: {
			name: 'Phone (2) White',
			bodyColor: '#f4f4f4',
			strokeColor: '#d1d5db',
			cameraBumpColor: '#e5e7eb',
			cableColor: '#d1d5db',
			glyphColor: '#ffffff',
			glyphActiveColor: '#ffffff'
		},
		dark: {
			name: 'Phone (2) Dark Gray',
			bodyColor: '#1a1a1a',
			strokeColor: '#333333',
			cameraBumpColor: '#262626',
			cableColor: '#333333',
			glyphColor: '#e5e5e5',
			glyphActiveColor: '#ffffff'
		},
		cyberpunk: {
			name: 'Cyberpunk Red',
			bodyColor: '#111111',
			strokeColor: '#f43f5e',
			cameraBumpColor: '#1e1b4b',
			cableColor: '#312e81',
			glyphColor: '#f43f5e',
			glyphActiveColor: '#ff0055'
		},
		matrix: {
			name: 'Matrix Green',
			bodyColor: '#052e16',
			strokeColor: '#22c55e',
			cameraBumpColor: '#14532d',
			cableColor: '#166534',
			glyphColor: '#4ade80',
			glyphActiveColor: '#22c55e'
		},
		nothing2a: {
			name: 'Phone (2a) Milk',
			bodyColor: '#faf8f5',
			strokeColor: '#e8e4dc',
			cameraBumpColor: '#f3ece3',
			cableColor: '#dfd7cc',
			glyphColor: '#ffffff',
			glyphActiveColor: '#ffffff'
		}
	};

	function applyPreset(presetKey: keyof typeof presets) {
		const preset = presets[presetKey];
		bodyColor = preset.bodyColor;
		strokeColor = preset.strokeColor;
		cameraBumpColor = preset.cameraBumpColor;
		cableColor = preset.cableColor;
		glyphColor = preset.glyphColor;
		glyphActiveColor = preset.glyphActiveColor;
	}

	// Code export string helper
	let codeSnippet = $derived(`
<NothingPhone
  active={${active}}
  showGrid={${showGrid}}
  bodyColor="${bodyColor}"
  strokeColor="${strokeColor}"
  cameraBumpColor="${cameraBumpColor}"
  cableColor="${cableColor}"
  glyphColor="${glyphColor}"
  glyphActiveColor="${glyphActiveColor}"
/>
`.trim());

	let copied = $state(false);
	function copyCode() {
		navigator.clipboard.writeText(codeSnippet);
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 2000);
	}
</script>

<svelte:head>
	<title>Nothing Phone Component Sandbox</title>
	<meta name="description" content="Interactive development workspace for NothingPhone.svelte" />
</svelte:head>

<div class="space-y-6">
	<!-- Top Navigation and Title -->
	<div class="flex justify-between items-center border-b border-border pb-3">
		<div>
			<span class="text-xxs font-mono uppercase text-muted">Dev Tools // Workspace</span>
			<h1 class="text-xl font-bold uppercase tracking-wider text-main mt-0.5">NothingPhone.svelte Sandbox</h1>
		</div>
		<a
			href="/gear"
			class="border border-border px-3 py-1 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-xs font-mono font-bold uppercase transition-colors"
		>
			← Back to Gear
		</a>
	</div>

	<!-- Main Workspace Split -->
	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		
		<!-- Left: Interactive Preview Panel -->
		<div class="flex flex-col gap-4">
			<h2 class="text-xs font-bold uppercase tracking-wider text-muted font-mono">1. Interactive Canvas</h2>
			
			<div 
				class="relative min-h-[460px] flex items-center justify-center border border-border overflow-hidden transition-all duration-300 rounded"
				class:bg-neutral-900={bgTheme === 'dark'}
				class:bg-neutral-50={bgTheme === 'light'}
				class:bg-blueprint={bgTheme === 'blueprint'}
				class:bg-transparent-grid={bgTheme === 'transparent-grid'}
				class:bg-dark-grid={bgTheme === 'dark-grid'}
			>
				<!-- Phone wrapper with sizing -->
				<div style="width: {width}px; height: {width * 2}px;" class="transition-all duration-150">
					<NothingPhone
						{active}
						{showGrid}
						{bodyColor}
						{strokeColor}
						{cameraBumpColor}
						{cableColor}
						{glyphColor}
						{glyphActiveColor}
					/>
				</div>

				<!-- Size Tag overlay -->
				<div class="absolute bottom-2 left-2 bg-black/60 backdrop-blur text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
					{width}px × {width * 2}px
				</div>
			</div>

			<!-- Canvas Background Toggles -->
			<div class="flex flex-wrap items-center gap-2">
				<span class="text-xxs font-mono text-muted uppercase mr-1">Canvas BG:</span>
				{#each ['dark-grid', 'blueprint', 'transparent-grid', 'dark', 'light'] as theme}
					<button
						onclick={() => (bgTheme = theme)}
						class="text-xxs font-mono border px-2 py-1 uppercase rounded transition-colors {bgTheme === theme ? 'border-accent bg-accent/10 text-accent font-bold' : 'border-border bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-muted'}"
					>
						{theme.replace('-', ' ')}
					</button>
				{/each}
			</div>
		</div>

		<!-- Right: Design Parameters -->
		<div class="space-y-5">
			<h2 class="text-xs font-bold uppercase tracking-wider text-muted font-mono">2. Design Parameters</h2>

			<!-- Quick Presets -->
			<div class="border border-border p-3 space-y-2 bg-neutral-50 dark:bg-neutral-900/40 rounded">
				<div class="text-xxs font-mono text-muted uppercase font-bold">Quick Presets</div>
				<div class="flex flex-wrap gap-2">
					{#each Object.keys(presets) as key}
						<button
							onclick={() => applyPreset(key as keyof typeof presets)}
							class="text-xxs font-mono border border-border px-2 py-1 rounded bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-colors uppercase text-main"
						>
							{presets[key as keyof typeof presets].name}
						</button>
					{/each}
				</div>
			</div>

			<!-- Control Sliders & Toggles -->
			<div class="border border-border p-3 space-y-4 bg-neutral-50 dark:bg-neutral-900/40 rounded">
				<div class="text-xxs font-mono text-muted uppercase font-bold">Interactive Controls</div>
				
				<!-- Size Slider -->
				<div class="space-y-1">
					<div class="flex justify-between text-xxs font-mono text-main">
						<span>PHONE WIDTH</span>
						<span>{width}px</span>
					</div>
					<input
						type="range"
						min="100"
						max="400"
						bind:value={width}
						class="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-accent"
					/>
				</div>

				<!-- Checkboxes -->
				<div class="grid grid-cols-2 gap-4 pt-1">
					<label class="flex items-center gap-2 cursor-pointer select-none">
						<input
							type="checkbox"
							bind:checked={active}
							class="w-3.5 h-3.5 accent-accent cursor-pointer"
						/>
						<span class="text-xxs font-mono text-main uppercase font-bold">GLYPHS ACTIVE</span>
					</label>
					
					<label class="flex items-center gap-2 cursor-pointer select-none">
						<input
							type="checkbox"
							bind:checked={showGrid}
							class="w-3.5 h-3.5 accent-accent cursor-pointer"
						/>
						<span class="text-xxs font-mono text-main uppercase font-bold">COORDINATE GRID</span>
					</label>
				</div>
			</div>

			<!-- Color Customizer -->
			<div class="border border-border p-3 space-y-3 bg-neutral-50 dark:bg-neutral-900/40 rounded">
				<div class="text-xxs font-mono text-muted uppercase font-bold">Color Palette (Hex)</div>
				
				<div class="grid grid-cols-2 gap-3">
					<!-- Body Color -->
					<div class="space-y-1">
						<label for="bodyColor" class="block text-xxs font-mono text-muted uppercase">Body Fill</label>
						<div class="flex gap-1.5">
							<input id="bodyColor" type="color" bind:value={bodyColor} class="w-6 h-6 border border-border p-0 cursor-pointer rounded" />
							<input type="text" aria-label="Body Fill Hex" bind:value={bodyColor} class="flex-1 text-xxs font-mono border border-border px-2 py-1 bg-background text-main rounded uppercase" />
						</div>
					</div>

					<!-- Stroke Color -->
					<div class="space-y-1">
						<label for="strokeColor" class="block text-xxs font-mono text-muted uppercase">Phone Outlines</label>
						<div class="flex gap-1.5">
							<input id="strokeColor" type="color" bind:value={strokeColor} class="w-6 h-6 border border-border p-0 cursor-pointer rounded" />
							<input type="text" aria-label="Phone Outlines Hex" bind:value={strokeColor} class="flex-1 text-xxs font-mono border border-border px-2 py-1 bg-background text-main rounded uppercase" />
						</div>
					</div>

					<!-- Camera Bump Color -->
					<div class="space-y-1">
						<label for="cameraBumpColor" class="block text-xxs font-mono text-muted uppercase">Camera Bump</label>
						<div class="flex gap-1.5">
							<input id="cameraBumpColor" type="color" bind:value={cameraBumpColor} class="w-6 h-6 border border-border p-0 cursor-pointer rounded" />
							<input type="text" aria-label="Camera Bump Hex" bind:value={cameraBumpColor} class="flex-1 text-xxs font-mono border border-border px-2 py-1 bg-background text-main rounded uppercase" />
						</div>
					</div>

					<!-- Cable Color -->
					<div class="space-y-1">
						<label for="cableColor" class="block text-xxs font-mono text-muted uppercase">Internal Ribbon</label>
						<div class="flex gap-1.5">
							<input id="cableColor" type="color" bind:value={cableColor} class="w-6 h-6 border border-border p-0 cursor-pointer rounded" />
							<input type="text" aria-label="Internal Ribbon Hex" bind:value={cableColor} class="flex-1 text-xxs font-mono border border-border px-2 py-1 bg-background text-main rounded uppercase" />
						</div>
					</div>

					<!-- Glyph Color -->
					<div class="space-y-1">
						<label for="glyphColor" class="block text-xxs font-mono text-muted uppercase">Glyph Idle Color</label>
						<div class="flex gap-1.5">
							<input id="glyphColor" type="color" bind:value={glyphColor} class="w-6 h-6 border border-border p-0 cursor-pointer rounded" />
							<input type="text" aria-label="Glyph Idle Color Hex" bind:value={glyphColor} class="flex-1 text-xxs font-mono border border-border px-2 py-1 bg-background text-main rounded uppercase" />
						</div>
					</div>

					<!-- Glyph Active Color -->
					<div class="space-y-1">
						<label for="glyphActiveColor" class="block text-xxs font-mono text-muted uppercase">Glyph Glow Color</label>
						<div class="flex gap-1.5">
							<input id="glyphActiveColor" type="color" bind:value={glyphActiveColor} class="w-6 h-6 border border-border p-0 cursor-pointer rounded" />
							<input type="text" aria-label="Glyph Glow Color Hex" bind:value={glyphActiveColor} class="flex-1 text-xxs font-mono border border-border px-2 py-1 bg-background text-main rounded uppercase" />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Code Exporter Panel -->
	<div class="border border-border p-4 bg-neutral-900 text-neutral-100 rounded space-y-2">
		<div class="flex justify-between items-center">
			<span class="text-xxs font-mono text-neutral-400 uppercase tracking-widest">Svelte 5 Component Usage</span>
			<button
				onclick={copyCode}
				class="border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-900 text-neutral-300 hover:text-white px-2.5 py-1 text-xxs font-mono font-bold uppercase transition-all rounded"
			>
				{copied ? '✓ COPIED' : 'COPY COMPONENT'}
			</button>
		</div>
		<pre class="text-xxs font-mono overflow-x-auto bg-black/40 p-3 border border-neutral-800 rounded text-amber-400 leading-normal"><code>{codeSnippet}</code></pre>
	</div>
</div>

<style>
	/* Background Styles */
	.bg-transparent-grid {
		background-color: #ffffff;
		background-image: radial-gradient(#d1d5db 1px, transparent 1px), radial-gradient(#d1d5db 1px, transparent 1px);
		background-size: 16px 16px;
		background-position: 0 0, 8px 8px;
	}

	.bg-dark-grid {
		background-color: #111827;
		background-image: 
			linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
			linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
		background-size: 20px 20px;
	}

	.bg-blueprint {
		background-color: #0c1e36;
		background-image: 
			linear-gradient(rgba(56, 189, 248, 0.15) 1px, transparent 1px),
			linear-gradient(90deg, rgba(56, 189, 248, 0.15) 1px, transparent 1px),
			linear-gradient(rgba(56, 189, 248, 0.05) 5px, transparent 5px),
			linear-gradient(90deg, rgba(56, 189, 248, 0.05) 5px, transparent 5px);
		background-size: 50px 50px, 50px 50px, 10px 10px, 10px 10px;
	}
</style>
