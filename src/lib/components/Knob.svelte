<script lang="ts">
	import { animate, clamp, spring } from 'animejs';
	import { reducedMotion } from '$lib/motion';
	import KnobCap from '$lib/components/KnobCap.svelte';

	/**
	 * A physical knob.
	 *
	 * Vertical drag (1px = 1 detent worth of travel), keyboard for the same job with
	 * arrows and Home/End, double-click to return to the module's preset. The cap rotates
	 * freely under the pointer and settles into the nearest detent on release with a
	 * spring — the only spring on the site, because a knob is a spring.
	 *
	 * `value` is the quantised position in degrees (-180…180), which is what the filter
	 * maths reads; the readout scale is that value mapped to 0…100.
	 */
	let {
		value = $bindable(0),
		label,
		cap = 'var(--hw-knob-1)',
		detent = 3.6,
		aria_label,
		onreset
	}: {
		value?: number;
		label: string;
		cap?: string;
		detent?: number;
		aria_label: string;
		onreset?: () => void;
	} = $props();

	let rotation = $state(value);
	let dragging = $state(false);
	let settling = $state(false);
	/** @type {any} */
	let settle_anim: ReturnType<typeof animate> | null = null;

	const quantize = (v: number) => clamp(Math.round(v / detent) * detent, -180, 180);
	const readout = (v: number) => Math.round((v + 180) / detent);

	/**
	 * Spring the cap into `target`'s detent. The value is committed immediately — the
	 * spring is how the cap looks getting there, not when the control takes effect, so
	 * held arrow keys accumulate instead of cancelling each other's animation.
	 */
	function settle(target: number) {
		settle_anim?.cancel();
		const next = quantize(target);
		value = next;
		// Reduced motion: the cap lands on the detent, it does not spring onto it.
		if (reducedMotion()) {
			rotation = next;
			return;
		}
		const proxy = { v: rotation };
		settling = true;
		settle_anim = animate(proxy, {
			v: next,
			ease: spring({ stiffness: 180, damping: 14 }),
			onUpdate: () => (rotation = proxy.v),
			onComplete: () => {
				rotation = next;
				settling = false;
			}
		});
	}

	// Presets move the cap too, unless a finger or a running spring owns it.
	$effect(() => {
		const external = value;
		if (!dragging && !settling) rotation = external;
	});

	function on_pointerdown(event: PointerEvent) {
		event.preventDefault();
		const el = event.currentTarget as HTMLElement;
		el.setPointerCapture(event.pointerId);
		dragging = true;
		settle_anim?.cancel();

		const start_y = event.clientY;
		const start_value = rotation;

		const on_move = (move: PointerEvent) => {
			// 0.42 degrees per pixel: the full 360° sweep is about one screen height.
			rotation = clamp(start_value + (start_y - move.clientY) * 0.42, -180, 180);
			value = quantize(rotation);
		};
		const on_up = (up: PointerEvent) => {
			el.releasePointerCapture(up.pointerId);
			el.removeEventListener('pointermove', on_move);
			el.removeEventListener('pointerup', on_up);
			el.removeEventListener('pointercancel', on_up);
			dragging = false;
			settle(rotation);
		};

		el.addEventListener('pointermove', on_move);
		el.addEventListener('pointerup', on_up);
		el.addEventListener('pointercancel', on_up);
	}

	function on_keydown(event: KeyboardEvent) {
		const step = 3.6;
		const big = 18;
		let next: number | null = null;
		switch (event.key) {
			case 'ArrowUp':
			case 'ArrowRight':
				next = value + step;
				break;
			case 'ArrowDown':
			case 'ArrowLeft':
				next = value - step;
				break;
			case 'PageUp':
				next = value + big;
				break;
			case 'PageDown':
				next = value - big;
				break;
			case 'Home':
				next = -180;
				break;
			case 'End':
				next = 180;
				break;
		}
		if (next === null) return;
		event.preventDefault();
		settle(clamp(next, -180, 180));
	}
</script>

<div class="flex flex-col items-center gap-1.5">
	<!-- Collar: a recessed seat with a printed scale, the cap turns inside it. -->
	<div class="knob-collar flex h-10 w-10 items-center justify-center rounded-full">
		<div
			class="cursor-ns-resize touch-none rounded-full select-none focus-visible:outline-offset-4 active:cursor-grabbing"
			onpointerdown={on_pointerdown}
			onkeydown={on_keydown}
			ondblclick={() => {
				onreset?.();
				settle(value);
			}}
			role="slider"
			aria-label={aria_label}
			aria-valuenow={readout(value)}
			aria-valuemin="0"
			aria-valuemax="100"
			aria-valuetext={`${readout(value)} of 100`}
			tabindex="0"
			title="Drag vertically, or use the arrow keys. Double-click to reset."
		>
			<KnobCap {cap} {rotation} size={28} />
		</div>
	</div>
	<span class="font-mono text-nano font-bold tracking-wider text-ink leading-none">{label}</span>
</div>

<style>
	.knob-collar {
		position: relative;
		background: var(--hw-case-2);
		box-shadow:
			inset 0 1px 3px var(--shadow-soft),
			0 1px 0 color-mix(in srgb, var(--hw-sheen) 25%, transparent);
	}
	/* Scale: twelve printed ticks round the seat. */
	.knob-collar::before {
		content: '';
		position: absolute;
		inset: 1px;
		border-radius: 50%;
		background: repeating-conic-gradient(var(--hw-key-ink) 0 1.6deg, transparent 1.6deg 30deg);
		-webkit-mask-image: radial-gradient(
			closest-side,
			transparent 84%,
			#000 86%,
			#000 97%,
			transparent 99%
		);
		mask-image: radial-gradient(closest-side, transparent 84%, #000 86%, #000 97%, transparent 99%);
		opacity: 0.55;
		transform: rotate(-0.8deg);
	}
</style>
