<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import ProfilePhoto from './ProfilePhoto.svelte';
	import { motionEnabled, reducedMotion } from '$lib/motion';
	import { po } from '$lib/stores/po100.svelte.js';
	import { isCharging, batteryLevel } from '$lib/stores/battery';
	import type { Po3dApi } from '$lib/three/po100';

	/**
	 * The PO-100's slot: the 2D module is the interface, the 3D model is the object
	 * being controlled. The canvas is opaque and event-transparent — `pointer-events:
	 * none` — so pointer input lands on the control panel beneath, which is why the
	 * model is registered to the panel's own measured geometry.
	 *
	 * Load order: power-on completes first; only then does the dynamic import of three
	 * start (a requestIdleCallback 2s timeout is the fallback). Mobile and reduced motion
	 * never initialize WebGL at all. If the context is unavailable or lost, the canvas
	 * is simply removed and the 2D module is exactly what it always was.
	 */
	type PoMode = 'LCD' | 'CRT' | 'GAMEBOY' | 'DOT_MATRIX' | 'NORMAL';

	let { scroll_mode = null }: { scroll_mode?: PoMode | null } = $props();

	let slot: HTMLDivElement | null = $state(null);
	let canvas: HTMLCanvasElement | null = $state(null);
	let attempt = $state(false);
	let ready = $state(false);
	let focus_within = $state(false);

	// Reactive: the model may arrive after the state it has to catch up with.
	let api: Po3dApi | null = $state(null);
	let disposed = false;

	/** Run `fn` after the boot sweep finishes, or when the browser goes idle — whichever first. */
	function afterBoot(fn: () => void) {
		let done = false;
		const finish = () => {
			if (done) return;
			done = true;
			fn();
		};
		if (document.documentElement.dataset.boot === 'done') return finish();
		const observer = new MutationObserver(() => {
			if (document.documentElement.dataset.boot === 'done') {
				observer.disconnect();
				finish();
			}
		});
		observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-boot'] });
		const idle = window.requestIdleCallback;
		if (idle) idle(finish, { timeout: 2000 });
		else setTimeout(finish, 2000);
	}

	/** Fractional geometry of the 2D module's own parts, so the model shares them. */
	function measure() {
		if (!slot) return null;
		const r = slot.getBoundingClientRect();
		const to_frac = (el: Element) => {
			const b = el.getBoundingClientRect();
			return {
				cx: (b.x + b.width / 2 - r.x) / r.width,
				cy: (b.y + b.height / 2 - r.y) / r.height,
				left: (b.x - r.x) / r.width,
				top: (b.y - r.y) / r.height,
				w: b.width / r.width,
				h: b.height / r.height
			};
		};
		const screen = slot.querySelector('[data-boot-screen]');
		const grill = slot.querySelector('[data-hw="grill"]');
		const strip = slot.querySelector('[data-hw="strip"]');
		const header = slot.querySelector('[data-hw="header"]');
		const buttons = [...slot.querySelectorAll('[aria-label^="Display mode"]')];
		const knobs = [...slot.querySelectorAll('[role="slider"]')];
		if (!screen || !grill || !strip || !header || buttons.length !== 5 || knobs.length !== 3) {
			return null;
		}
		return {
			slotW: r.width,
			slotH: r.height,
			screen: to_frac(screen),
			grill: to_frac(grill),
			strip: to_frac(strip),
			header: to_frac(header),
			buttons: buttons.map(to_frac),
			knobs: knobs.map(to_frac)
		};
	}

	let init_started = false;

	async function init() {
		if (init_started || !canvas || !slot) return;
		init_started = true;
		const layout = measure();
		if (!layout) return;
		const the_canvas = canvas;

		let hooks;
		try {
			const { initPo3d } = await import('$lib/three/po100.js');
			hooks = await initPo3d(
				the_canvas,
				slot,
				layout,
				{ mode: po.mode, knobs: [po.freq, po.phase, po.rgb] },
				(a) => {
					api = a;
					if (!disposed) ready = true;
					a.setContextLostHandler(() => {
						// The scene has already torn itself down; drop the dead canvas too.
						ready = false;
						api = null;
						attempt = false;
					});
				}
			);
		} catch (err) {
			// The canvas just never appears; the 2D module is exactly what it always was.
			console.info('PO-100 3D: initialization skipped.', err instanceof Error ? err.message : err);
			attempt = false;
			return;
		}
		if (hooks === null) {
			attempt = false;
			return;
		}
		if (disposed) {
			hooks.dispose();
			return;
		}
	}

	/* Live state into the model: mode swaps the screen and lights the LED. */
	$effect(() => {
		const mode = po.mode;
		if (api) api.setMode(mode);
	});

	/* Knob values drive the 3D knobs, live. */
	$effect(() => {
		const values = [po.freq, po.phase, po.rgb];
		const hooks = api;
		if (hooks) values.forEach((v, i) => hooks.setKnob(i, v));
	});

	/* The charging cable is the 2D module's easter egg; the model plugs in with it. */
	$effect(() => {
		const on = $isCharging;
		const level = $batteryLevel;
		api?.setCharging(on, level);
	});

	/** Cheap probe: without WebGL2, three is never downloaded and nothing is logged twice. */
	function webglAvailable() {
		try {
			const probe = document.createElement('canvas').getContext('webgl2');
			if (!probe) return false;
			probe.getExtension('WEBGL_lose_context')?.loseContext();
			return true;
		} catch {
			return false;
		}
	}

	onMount(() => {
		// Mobile and reduced motion keep the 2D module and never touch WebGL.
		if (!motionEnabled() || reducedMotion()) return;
		if (window.innerWidth < 768) return;
		if (!webglAvailable()) {
			console.info('PO-100 3D: WebGL unavailable, keeping the 2D module.');
			return;
		}
		afterBoot(() => {
			attempt = true;
		});
	});

	$effect(() => {
		if (!attempt || !canvas || !slot) return;
		init();
	});

	onDestroy(() => {
		disposed = true;
		api?.dispose();
		api = null;
	});
</script>

<div
	bind:this={slot}
	class="po3d-slot"
	onfocusin={(e) => {
		// Keyboard focus only: a mouse click on a key must not pull the 3D view away.
		const el = e.target as HTMLElement | null;
		focus_within = !!el?.matches?.(':focus-visible');
	}}
	onfocusout={(e) => {
		if (!slot?.contains(e.relatedTarget as Node)) focus_within = false;
	}}
>
	<ProfilePhoto {scroll_mode} covered={ready} />
	{#if attempt}
		<canvas
			bind:this={canvas}
			class="po3d-canvas"
			class:po3d-ready={ready}
			class:po3d-hidden={focus_within}
			aria-hidden="true"
			tabindex="-1"
		></canvas>
	{/if}
</div>

<style>
	.po3d-slot {
		position: relative;
		width: 100%;
	}

	/*
		The canvas covers exactly the module's box — any overhang would paint panel
		colour over the chassis around it. The device is framed a few percent inside,
		which is the room the tilt needs. It never captures input, and it steps out
		while any 2D control has focus so keys and knobs show their real focus rings.
	*/
	.po3d-canvas {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		opacity: 0;
		/* Above the 2D module's own `z-10` flex items — they share this stacking
		   context, so the canvas has to outrank them to cover the panel. */
		z-index: 20;
	}

	.po3d-ready {
		opacity: 1;
		animation: po3d-on 200ms steps(3, end);
	}
	/*
		While a 2D control holds focus the canvas steps out: the real controls and their
		focus rings must be visible. Instant, not animated — a state change, not a fade.
	*/
	.po3d-hidden {
		opacity: 0;
		animation: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.po3d-ready {
			animation: none;
		}
	}

	@keyframes po3d-on {
		0% {
			opacity: 0;
		}
		40% {
			opacity: 1;
		}
		62% {
			opacity: 0.3;
		}
		100% {
			opacity: 1;
		}
	}
</style>
