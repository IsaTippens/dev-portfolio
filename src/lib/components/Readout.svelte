<script lang="ts">
	import { untrack } from 'svelte';
	import { animate, utils } from 'animejs';
	import { EASE_SNAP, reducedMotion } from '#lib/motion/index.js';

	/**
	 * A numeric readout — FPS, POS, BAT, VAL. It ticks up to its value the first time it
	 * appears (stepped rounding, never a fade), then tracks its value directly, because
	 * a knob readout has to move with the knob. A value that changes mid tick-up cancels
	 * the tween and is shown as is; a first value equal to the shown 0 has nothing to
	 * tick through.
	 */
	let {
		value,
		pad = 0,
		suffix = '',
		duration = 300,
		class: klass = ''
	}: {
		value: number;
		pad?: number;
		suffix?: string;
		duration?: number;
		class?: string;
	} = $props();

	let shown = $state(0);
	let settled = false;
	let tick: ReturnType<typeof animate> | undefined;

	$effect(() => {
		const target = Math.round(value);
		tick?.cancel();
		tick = undefined;
		const from = untrack(() => shown);
		if (settled || from === target || reducedMotion()) {
			settled = true;
			shown = target;
			return;
		}
		settled = true;
		const proxy = { v: from };
		tick = animate(proxy, {
			v: target,
			duration,
			ease: EASE_SNAP,
			modifier: utils.round(0),
			onUpdate: () => {
				shown = proxy.v;
			}
		});
	});

	$effect(() => () => tick?.cancel());

	const text = $derived(pad ? `${String(shown).padStart(pad, '0')}${suffix}` : `${shown}${suffix}`);
</script>

<span class="tabular-nums {klass}">{text}</span>
