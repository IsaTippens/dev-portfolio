<script lang="ts">
	import { animate, utils } from 'animejs';
	import { EASE_SNAP, STEPS_FLICKER, reducedMotion } from '$lib/motion';

	/**
	 * A numeric readout — FPS, POS, BAT, VAL. It ticks up to its value the first time it
	 * appears (stepped rounding, never a fade), then tracks its value directly, because
	 * a knob readout has to move with the knob.
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

	$effect(() => {
		const target = Math.round(value);
		if (settled || reducedMotion()) {
			settled = true;
			shown = target;
			return;
		}
		const proxy = { v: shown };
		settled = true;
		animate(proxy, {
			v: target,
			duration,
			ease: EASE_SNAP,
			modifier: utils.round(0),
			onUpdate: () => {
				shown = proxy.v;
			}
		});
	});

	const text = $derived(
		pad ? `${String(Math.round(shown)).padStart(pad, '0')}${suffix}` : `${Math.round(shown)}${suffix}`
	);
</script>

<span class="tabular-nums {klass}" data-readout data-steps={STEPS_FLICKER}>{text}</span>
