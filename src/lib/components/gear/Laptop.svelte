<script lang="ts">
	/**
	 * A 16" laptop, lid up, seen from the front and a little above. The deck is a trapezoid
	 * (its front edge is nearer, so wider); the keyboard is laid out flat in key units and
	 * projected onto it corner by corner. Units are millimetres of lid.
	 */
	const LID_W = 357;
	const LID_H = 232;
	/** Hinge to front edge, on screen. */
	const DECK_DEPTH = 88;
	/** How far the front edge overhangs the hinge on each side. */
	const DECK_SPREAD = 26;

	/** A point on the deck: `u` across (0 left, 1 right), `v` from hinge (0) to front edge (1). */
	function deck(u: number, v: number): string {
		const left = -DECK_SPREAD * v;
		const right = LID_W + DECK_SPREAD * v;
		const x = left + u * (right - left);
		const y = LID_H + DECK_DEPTH * v;
		return `${x.toFixed(1)} ${y.toFixed(1)}`;
	}

	/** The deck quad spanning `u0..u1` × `v0..v1`, as one closed subpath. */
	const quad = (u0: number, v0: number, u1: number, v1: number) =>
		`M${deck(u0, v0)}L${deck(u1, v0)}L${deck(u1, v1)}L${deck(u0, v1)}Z`;

	/** Keyboard rows, back to front: [row height, key widths], in key units (1 = a letter key). */
	const ROWS: [number, number[]][] = [
		[0.6, Array(15).fill(1)],
		[1, [...Array(13).fill(1), 2]],
		[1, [1.5, ...Array(12).fill(1), 1.5]],
		[1, [1.75, ...Array(11).fill(1), 2.25]],
		[1, [2.25, ...Array(10).fill(1), 1.75, 1]],
		[1, [1.25, 1, 1, 1.25, 5.5, 1, 1, 1, 1, 1]]
	];
	/** Where the keyboard sits on the deck, and its size in key units: 15 main, ½ gap, 4 numpad. */
	const KB = { u0: 0.045, u1: 0.955, v0: 0.08, v1: 0.6, width: 19.5, height: 5.6, gap: 0.09 };
	const NUMPAD_X = 15.5;

	function keys(): string {
		const u = (x: number) => KB.u0 + (x / KB.width) * (KB.u1 - KB.u0);
		const v = (y: number) => KB.v0 + (y / KB.height) * (KB.v1 - KB.v0);
		const key = (x: number, y: number, w: number, h: number) =>
			quad(u(x + KB.gap), v(y + KB.gap), u(x + w - KB.gap), v(y + h - KB.gap));
		let d = '';
		let y = 0;
		for (const [h, widths] of ROWS) {
			let x = 0;
			for (const w of widths) {
				d += key(x, y, w, h);
				x += w;
			}
			for (let n = 0; n < 4; n++) d += key(NUMPAD_X + n, y, 1, h);
			y += h;
		}
		return d;
	}

	const KEYS = keys();
	const TOUCHPAD = quad(0.265, 0.67, 0.525, 0.95);
</script>

<svg
	viewBox="-30 -4 417 337"
	class="line-art relative block h-full w-full"
	role="img"
	aria-label="Line drawing of an open 16-inch laptop"
>
	<path
		d="M0 232H357L383 320V325A4 4 0 0 1 379 329H-22A4 4 0 0 1 -26 325V320Z"
		fill="var(--panel)"
		stroke="var(--ink-dim)"
		stroke-linejoin="round"
	/>
	<path d="M-26 320H383" fill="none" stroke="var(--line)" />
	<g fill="var(--panel-sunk)" stroke="var(--line)">
		<path d={KEYS} />
		<path d={TOUCHPAD} />
	</g>
	<rect width="357" height="232" rx="6" fill="var(--panel)" stroke="var(--ink-dim)" />
	<rect
		x="7"
		y="9"
		width="343"
		height="214.4"
		rx="1"
		fill="var(--panel-sunk)"
		stroke="var(--line)"
	/>
	<circle cx="178.5" cy="4.5" r="1.6" fill="var(--ink-dim)" />
	<path d="M62 9V223.4M7 213H350" fill="none" stroke="var(--line)" />
	<!-- Editor on screen: file tree, then code. -->
	<path
		d="M15 22h30M15 30h24M15 38h34M15 46h20M15 54h28M74 22h60M74 31h84M82 40h52M82 49h110M90 58h72M90 67h40M82 76h96M74 85h30M74 94h66M82 103h88M90 112h58M82 121h44"
		fill="none"
		stroke="var(--ink-dim)"
		stroke-linecap="round"
		opacity="0.5"
	/>
</svg>
