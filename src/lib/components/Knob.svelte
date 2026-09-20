<script lang="ts">
	import { animate, clamp, spring } from 'animejs';
	import { reducedMotion } from '$lib/motion';

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
		cap = 'var(--hw-knob-freq)',
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

<div class="flex flex-col items-center gap-1">
	<div class="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--hw-case-line)] bg-[var(--hw-case-2)] shadow-[inset_1px_1px_3px_var(--shadow-soft)]">
		<div
			class="relative flex h-7 w-7 cursor-ns-resize touch-none items-center justify-center rounded-full border border-[var(--hw-knob-edge)] shadow-md select-none active:cursor-grabbing"
			style="background: {cap}; transform: rotate({rotation}deg);"
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
			<div class="absolute top-0.5 h-3 w-0.5 rounded-b-[1px] bg-[var(--hw-well-2)]"></div>
		</div>
	</div>
	<div class="flex flex-col items-center leading-none">
		<span class="font-mono text-nano font-bold tracking-wider text-ink">{label}</span>
	</div>
</div>
