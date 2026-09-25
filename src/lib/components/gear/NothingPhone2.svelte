<script lang="ts">
	/**
	 * Nothing Phone (2), back. Traced in millimetres (76.4 × 162.1 body) from Nothing's
	 * product render; the eleven Glyph segments sit where the Glyph Developer Kit places
	 * A1–E1. The drawing is a toggle that plays a notification: every Glyph double-flashes,
	 * the camera ring first and the exclamation mark last. A tap, click or Enter/Space keeps
	 * it playing; a mouse also plays it while it hovers.
	 *
	 * On every plug-in the exclamation mark (D1 over E1) becomes the charging meter the
	 * real phone shows: the dot lights first, the bar climbs from its foot to the
	 * battery's level, holds 2.5s, and drains again. The run takes priority over the
	 * notification flash, which is suspended while it plays.
	 */
	import { isCharging, batteryLevel } from '$lib/stores/battery';

	/** Length of one charging-Glyph run: climb 0.1s, hold 2.5s, drain 0.1s. */
	const CHARGE_GLYPH_MS = 2700;

	/** Held by a tap, click or Enter/Space; previewed while a mouse (never a finger) is over it. */
	let held = $state(false);
	let previewing = $state(false);

	/** One climb–hold–drain run of the charging bar, restarted on every plug-in. */
	let charge_run = $state(false);
	let was_charging = false;
	let run_timer: number | undefined;

	$effect(() => {
		const now = $isCharging;
		const plugged = !was_charging && now;
		was_charging = now;
		window.clearTimeout(run_timer);
		if (plugged) {
			charge_run = true;
			run_timer = window.setTimeout(() => (charge_run = false), CHARGE_GLYPH_MS);
		} else if (!now) {
			charge_run = false;
		}
		return () => window.clearTimeout(run_timer);
	});
</script>

<button
	type="button"
	class="relative block h-full w-full"
	aria-pressed={held}
	aria-label="Line drawing of the back of the Nothing Phone (2): play a Glyph notification"
	data-on={(held || previewing) && !charge_run}
	data-charging={$isCharging}
	data-charge-run={charge_run}
	onclick={() => (held = !held)}
	onpointerenter={(e) => (previewing = e.pointerType === 'mouse')}
	onpointerleave={() => (previewing = false)}
>
	<svg viewBox="-2 -2 80.4 166.1" class="line-art block h-full w-full" aria-hidden="true">
		<rect width="76.4" height="162.1" rx="10.5" fill="var(--panel)" stroke="var(--ink-dim)" />
		<g fill="none" stroke="var(--line)" stroke-linejoin="round">
			<rect x="3.6" y="3.6" width="69.2" height="154.9" rx="7" />
			<path d="M3.9 44.4H15A43.5 43.5 0 0 1 26.1 39.4V8.3L21.4 3.6H8.9A5 5 0 0 0 3.9 8.6Z" />
			<path d="M26.1 37.6H72.8M63 3.6V9.7L50.2 27.3Q45.9 32.2 45.9 34V37.6" />
			<path d="M3.6 107.95A43.5 43.5 0 0 0 38.2 124.7H61.2V121.4H72.8" />
			<path d="M7.4 58.8A38 38 0 0 1 69 58.8V103.6A38 38 0 0 1 7.4 103.6Z" />
			<circle cx="38.2" cy="81.2" r="30" />
			<circle cx="38.2" cy="81.2" r="25" />
			<circle cx="38.2" cy="81.2" r="20" />
			<circle cx="38.2" cy="81.2" r="15" />
			<circle cx="38.2" cy="81.2" r="9.8" fill="var(--panel-sunk)" />
			<path d="M14.6 158.5V130.3A4.3 4.3 0 0 1 18.9 126H26.8V134.6H23V158.5" />
			<rect x="12.4" y="115.4" width="1.2" height="31" rx="0.6" />
			<path
				d="M23 140.3H35.1V158.5M72.8 141.7H45.5L41.1 147.6V158.5M55 158.5V155.2A2.5 2.5 0 0 1 60 155.2V158.5"
			/>
			<rect x="50.3" y="142" width="10.6" height="2.2" rx="1.1" />
			<rect x="63.9" y="40.7" width="4.4" height="4.4" rx="0.8" />
			<circle cx="6.4" cy="41.1" r="1.4" />
			<circle cx="66.9" cy="82.4" r="1.1" />
		</g>
		<g fill="none" stroke="var(--ink-dim)">
			<circle cx="14.9" cy="14.87" r="6.5" fill="var(--panel-sunk)" />
			<circle cx="14.9" cy="14.87" r="4.4" stroke="var(--line)" />
			<circle cx="14.9" cy="14.87" r="2.4" />
			<circle cx="14.9" cy="30.33" r="6.5" fill="var(--panel-sunk)" />
			<circle cx="14.9" cy="30.33" r="4.4" stroke="var(--line)" />
			<circle cx="14.9" cy="30.33" r="2.4" />
			<circle cx="30.5" cy="17.4" r="2.7" />
			<rect x="29" y="21.8" width="3.1" height="7.9" rx="1.55" />
			<circle cx="55.7" cy="32" r="3.3" />
			<rect x="54.8" y="30.05" width="1.8" height="3.9" rx="0.9" />
			<path d="M72.3 15.3A10.7 10.7 0 0 0 72.3 36.7" />
		</g>
		<g fill="var(--ink-dim)">
			<circle cx="14.9" cy="14.87" r="0.7" />
			<circle cx="14.9" cy="30.33" r="0.7" />
			<circle cx="30.5" cy="17.4" r="0.6" />
			<rect x="68.9" y="25.5" width="3.4" height="1" />
		</g>
		<g fill="var(--line)" stroke="var(--ink-dim)">
			<circle cx="27.5" cy="6.1" r="1.3" />
			<circle cx="69.9" cy="7.8" r="1.3" />
			<circle cx="6.4" cy="155.5" r="1.3" />
			<circle cx="31.8" cy="155.9" r="1.3" />
			<circle cx="29.8" cy="143.4" r="1.3" />
			<circle cx="67.4" cy="156.6" r="1.3" />
		</g>
		<text
			x="8.2"
			y="140.3"
			transform="rotate(-90 8.2 140.3)"
			text-anchor="middle"
			dominant-baseline="central"
			font-family="var(--font-mono)"
			font-size="3"
			textLength="12.4"
			fill="var(--ink-dim)">NOTHING</text
		>
		<g>
			<!-- A1 -->
			<path
				class="glyph"
				d="M5.63 25.51V14.87A9.27 9.27 0 0 1 24.17 14.87H21.77A6.87 6.87 0 0 0 8.03 14.87V25.51Z"
			/>
			<!-- A2 -->
			<path
				class="glyph"
				d="M21.77 22.64H24.17V30.33A9.27 9.27 0 0 1 9.32 37.73L10.77 35.82A6.87 6.87 0 0 0 21.77 30.33Z"
			/>
			<!-- B1 -->
			<rect
				class="glyph"
				style="--delay: 80ms"
				x="46.97"
				y="17.8"
				width="23.27"
				height="2.4"
				rx="1.2"
				transform="rotate(-50.05 58.6 19)"
			/>
			<!-- C1 -->
			<path
				class="glyph"
				style="--delay: 160ms"
				d="M32.2 40.09A41.55 41.55 0 0 1 70.67 55.28A1.2 1.2 0 0 1 68.8 56.78A39.15 39.15 0 0 0 32.55 42.46A1.2 1.2 0 0 1 32.2 40.09Z"
			/>
			<!-- C2 -->
			<path
				class="glyph"
				style="--delay: 160ms"
				d="M5.73 55.28A41.55 41.55 0 0 1 20.77 43.48A1.2 1.2 0 0 1 21.78 45.66A39.15 39.15 0 0 0 7.6 56.78A1.2 1.2 0 0 1 5.73 55.28Z"
			/>
			<!-- C3 -->
			<rect
				class="glyph"
				style="--delay: 160ms"
				x="4.7"
				y="62.1"
				width="2.4"
				height="19.1"
				rx="1.2"
			/>
			<!-- C4 -->
			<path
				class="glyph"
				style="--delay: 160ms"
				d="M44.13 122.33A41.55 41.55 0 0 1 5.73 107.12A1.2 1.2 0 0 1 7.6 105.62A39.15 39.15 0 0 0 43.78 119.95A1.2 1.2 0 0 1 44.13 122.33Z"
			/>
			<!-- C5 -->
			<path
				class="glyph"
				style="--delay: 160ms"
				d="M70.67 107.12A41.55 41.55 0 0 1 55.56 118.95A1.2 1.2 0 0 1 54.56 116.77A39.15 39.15 0 0 0 68.8 105.62A1.2 1.2 0 0 1 70.67 107.12Z"
			/>
			<!-- C6 -->
			<rect
				class="glyph"
				style="--delay: 160ms"
				x="69.3"
				y="81.3"
				width="2.4"
				height="15.1"
				rx="1.2"
			/>
			<!-- D1 -->
			<rect
				class="glyph charge-line"
				style="--delay: 240ms"
				x="37"
				y="130.7"
				width="2.4"
				height="18.5"
				rx="1.2"
			/>
			<!-- Charging meter over D1: same bar in lit ink, grown from its foot to the
			     battery's level. Unknown level reads as full. -->
			<rect
				class="charge-fill"
				style="--level: {($batteryLevel ?? 100) / 100}"
				x="37"
				y="130.7"
				width="2.4"
				height="18.5"
				rx="1.2"
			/>
			<!-- E1 -->
			<rect
				class="glyph charge-dot"
				style="--delay: 240ms"
				x="37"
				y="151.7"
				width="2.4"
				height="3.4"
				rx="1.2"
			/>
		</g>
	</svg>
</button>

<style>
	/* Unlit, a Glyph is a diffuser the colour of the plate's lines; lit, it is ink. */
	.glyph {
		fill: var(--line);
		stroke: var(--ink-dim);
	}

	[data-on='true'] .glyph {
		animation: glyph-flash 1400ms steps(1, end) var(--delay, 0ms) infinite;
	}

	/* LEDs step, they never fade: on, off, on, then dark until the bar comes round. */
	@keyframes glyph-flash {
		0% {
			fill: var(--ink);
			stroke: var(--ink);
		}
		7% {
			fill: var(--line);
			stroke: var(--ink-dim);
		}
		14% {
			fill: var(--ink);
			stroke: var(--ink);
		}
		21%,
		100% {
			fill: var(--line);
			stroke: var(--ink-dim);
		}
	}

	/* Charging meter: a lit bar over D1, scaled from its foot. Dark between runs. */
	.charge-fill {
		fill: var(--ink);
		stroke: var(--ink);
		transform: scaleY(0);
		transform-box: fill-box;
		transform-origin: bottom;
	}

	/* While a charge run plays it takes priority: the notification flash is gated off
	   in the markup, the dot holds lit and the bar belongs to the meter. */
	[data-charge-run='true'] .charge-dot {
		fill: var(--ink);
		stroke: var(--ink);
	}

	/* Each plug-in: the bar climbs from its foot to the battery's level, holds
	   2.5s (3.7–96.3% of the 2.7s run), and drains again. */
	[data-charge-run='true'] .charge-fill {
		animation: glyph-charge 2700ms linear;
	}
	@keyframes glyph-charge {
		0% {
			transform: scaleY(0);
		}
		3.7% {
			transform: scaleY(var(--level));
		}
		96.3% {
			transform: scaleY(var(--level));
		}
		100% {
			transform: scaleY(0);
		}
	}

	/* Reduced motion: no climb; the meter rests at the battery's level. */
	@media (prefers-reduced-motion: reduce) {
		[data-charging='true'] .charge-fill {
			animation: none;
			transform: scaleY(var(--level));
		}
	}

	/* Reduced motion: a notification is the Glyphs held lit, not flashed. */
	@media (prefers-reduced-motion: reduce) {
		[data-on='true'] .glyph {
			animation: none;
			fill: var(--ink);
			stroke: var(--ink);
		}
	}
</style>
