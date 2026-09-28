<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { animate } from 'animejs';
	import Panel from '$lib/components/Panel.svelte';
	import Readout from '$lib/components/Readout.svelte';
	import { RELIEF } from '$lib/components/cartography-relief';
	import { onScrollProgress } from '$lib/motion/scrub.js';
	import { reducedMotion, motionEnabled, EASE_SNAP, PANEL } from '$lib/motion';
	import { sunPosition, CIVIL_DUSK, type SunPosition } from '$lib/cartography/sun';
	import { fetchWind, isCapeDoctor, compassPoint, type Wind } from '$lib/cartography/wind';
	import { signalFrom, CAPE_TOWN, type Signal } from '$lib/cartography/signal';

	/**
	 * CARTOGRAPHY_CPT — road survey radiating out of Cape Town.
	 *
	 * Coastline is Natural Earth 1:10m land, projected equirectangular about 34°S
	 * (x = Δlon·cos 34°·380, y = −Δlat·380, origin 18.20°E 33.68°S), so the plate
	 * reads as the real peninsula and the scale bar is honest.
	 *
	 * The road network is scrubbed by scroll position, not played on a clock: it grows
	 * out of the city as the module crosses the viewport and pulls back in when the
	 * visitor scrolls up. During the power-on sequence the same growth runs at a fixed
	 * duration, so the map comes up already on the table.
	 */
	let map: SVGSVGElement | null = $state(null);
	let net_km = $state(0);

	/**
	 * Main routes out of the city, waypoints hand-placed from the real alignments.
	 * `from` names the road this one branches off at its far end; roots start in
	 * the CBD. Growth is by network distance, so every road front advances at the
	 * same speed and branches only start once their parent reaches the junction.
	 */
	type Road = { name: string; major: boolean; from: string | null; d: string };
	const ROADS: Road[] = [
		{ name: 'N1', major: true, from: null, d: 'M 70.9,92 C 73.2,90.9 80.6,87.3 85.1,85.5 C 89.5,83.7 92.9,81.7 97.7,80.9 C 102.4,80.2 107.1,80.6 113.4,80.9 C 119.7,81.3 128.1,84.4 135.5,82.8 C 142.8,81.3 149.6,75.4 157.5,71.4 C 165.4,67.5 174.3,62.6 182.7,58.9 C 191.1,55.2 200,54.2 207.9,49.4 C 215.8,44.7 223.1,36.1 230,30.4 C 236.8,24.7 241,19.6 248.9,15.2 C 256.8,10.8 268.3,7.6 277.2,3.8 C 286.2,-0 298.2,-5.7 302.4,-7.6' },
		{ name: 'N2', major: true, from: null, d: 'M 70.9,92 C 73.2,93.1 79.5,96.7 85.1,98.8 C 90.6,100.9 97.1,102.3 104,104.5 C 110.8,106.7 118.1,108.6 126,112.1 C 133.9,115.6 142.8,121 151.2,125.4 C 159.6,129.8 168.5,134.9 176.4,138.7 C 184.3,142.5 191.1,144.1 198.5,148.2 C 205.8,152.3 214.7,159 220.5,163.4 C 226.3,167.8 226.8,172 233.1,174.8 C 239.4,177.7 248.9,177.3 258.3,180.5 C 267.8,183.7 279.9,189 289.8,193.8 C 299.8,198.5 306.1,204.6 318.2,209 C 330.3,213.4 354.9,218.5 362.3,220.4' },
		{ name: 'N7', major: true, from: null, d: 'M 75.6,88.2 C 78.2,86.4 86.6,81.5 91.4,77.9 C 96.1,74.3 100.3,71.9 104,66.5 C 107.6,61.1 110.3,52.9 113.4,45.6 C 116.6,38.3 119.7,31.7 122.9,22.8 C 126,13.9 130.7,-2.5 132.3,-7.6' },
		{ name: 'M3', major: false, from: null, d: 'M 69.3,95 C 70.9,96.6 76.6,100.7 78.8,104.5 C 81,108.3 81.9,111.8 82.5,117.8 C 83.2,123.8 82.4,133.6 82.5,140.6 C 82.7,147.6 83.3,156.4 83.5,159.6' },
		{ name: 'M6', major: false, from: null, d: 'M 67.7,93.1 C 65.9,94.7 59.9,98.5 56.7,102.6 C 53.6,106.7 49.6,112.7 48.8,117.8 C 48,122.9 50.9,129.2 52,133 C 53,136.8 55.1,137.1 55.1,140.6 C 55.1,144.1 52.2,149.8 52,153.9 C 51.7,158 50.1,162.1 53.6,165.3 C 57,168.5 69.3,171.6 72.5,172.9' },
		{ name: 'R27', major: false, from: null, d: 'M 80.3,89.3 C 82.7,86.4 92.3,77.6 94.5,72.2 C 96.7,66.8 94.8,62.7 93.6,57 C 92.4,51.3 89.5,44.3 87.3,38 C 85.1,31.7 82.3,26.6 80.3,19 C 78.4,11.4 76.4,-3.2 75.6,-7.6' },
		{ name: 'M4', major: false, from: 'M3', d: 'M 83.5,159.6 C 81.6,161.8 74,167.2 72.5,172.9 C 70.9,178.6 72.7,186.5 74,193.8 C 75.3,201.1 79.3,209.6 80.3,216.6 C 81.4,223.6 78.9,229.6 80.3,235.6 C 81.8,241.6 87.4,249.8 88.8,252.7' },
		{ name: 'R310', major: false, from: 'M3', d: 'M 83.5,159.6 C 85.8,158 92.7,152.4 97.7,150.1 C 102.6,147.8 106.1,146.5 113.4,145.5 C 120.8,144.6 132.3,144.1 141.8,144.4 C 151.2,144.7 162.2,145.9 170.1,147.4 C 178,149 184.8,151.6 189,153.9 C 193.2,156.2 194.3,160.2 195.3,161.5' },
		{ name: 'R44', major: false, from: 'R310', d: 'M 195.3,161.5 C 197.7,164.7 207.9,173.9 209.5,180.5 C 211.1,187.2 206.6,192.9 204.8,201.4 C 202.9,210 197.4,223.2 198.5,231.8 C 199.5,240.3 203.7,249.8 211.1,252.7 C 218.4,255.5 233.7,250.2 242.6,248.9 C 251.5,247.6 261,245.7 264.6,245.1' },
		{ name: 'R43', major: false, from: 'N2', d: 'M 318.2,209 C 317.1,215.3 314,237.2 311.9,247 C 309.8,256.8 303.2,262.7 305.6,267.9 C 307.9,273.1 322.6,276.4 326.1,278.2' },
	];

	/** Kilometres per viewBox unit: 1° of latitude is 380 units. */
	const KM_PER_UNIT = 111.32 / 380;

	const road_els: SVGPathElement[] = [];
	/** Per road: network distance at which it starts, and its own length. */
	let spans: { start: number; length: number }[] = [];
	let net_length = 0;

	function measure() {
		const by_name = new Map<string, { start: number; length: number }>();
		spans = ROADS.map((road, i) => {
			const parent = road.from ? by_name.get(road.from) : undefined;
			const span = {
				start: parent ? parent.start + parent.length : 0,
				length: road_els[i].getTotalLength()
			};
			by_name.set(road.name, span);
			return span;
		});
		net_length = Math.max(...spans.map((s) => s.start + s.length));
	}

	/**
	 * Cursor parallax. The survey is a relief model under glass: depth 0 is the
	 * glass, sea-level land sits a little behind it, and the terrain rises
	 * through it in real contour steps, so the peaks stand proud of the plate.
	 * Hovering zooms every layer by its depth — negative depths shrink away,
	 * positive ones come forward — and the cursor pulls them sideways by that
	 * same depth: the mountains slide against the cursor, the lowland with it.
	 *
	 * Skipped under reduced motion: this is decoration, never information. Zoom
	 * fades in and out with the panel curve; the cursor-driven part has no
	 * duration at all, like the scroll scrub. Touch screens have no hover, so a
	 * tap toggles the same effect driven by device tilt instead (see below).
	 */
	const ZOOM = 0.14; // near-layer scale at full hover
	const SHIFT = 14; // near-layer travel at the plate edge, in viewBox units

	/**
	 * Pivot for the zoom: the centre of `viewBox="0 0 353 296"`, in user units.
	 * Written into the transform itself — attribute transforms are plain user-space
	 * matrices, so `transform-box` / `transform-origin` never enter into it.
	 */
	const PIVOT_X = 176.5;
	const PIVOT_Y = 148;

	let plate: HTMLDivElement | null = $state(null);
	let grid_el: SVGGElement | null = $state(null);
	let coast_el: SVGGElement | null = $state(null);
	const relief_els: SVGGElement[] = [];
	let water_el: SVGGElement | null = $state(null);
	let marks_el: SVGGElement | null = $state(null);
	let summit_el: SVGGElement | null = $state(null);
	let cloud_el: SVGGElement | null = $state(null);
	let near_el: SVGGElement | null = $state(null);

	const SEA_LEVEL = -0.3; // land at 0 m sinks behind the glass
	const PEAK = 0.7; // …and the terrain rises to this at RELIEF_TOP
	const RELIEF_TOP = 1800; // metres; highest contour on the plate
	/** Depth of ground at `m` metres: linear in height, so steps read true. */
	const altitude = (m: number) => SEA_LEVEL + (m / RELIEF_TOP) * (PEAK - SEA_LEVEL);
	/** Hypsometric tint: how much ink each terrace mixes into the plate colour. */
	const tint = (m: number) =>
		`color-mix(in srgb, var(--ink) ${(4 + (m / RELIEF_TOP) * 14).toFixed(1)}%, var(--panel-sunk))`;

	/**
	 * Layer elements with their depth. The roads and lowland marks ride on the
	 * land, just above sea level; Table Mountain's marker, and the tablecloth
	 * when there is one, ride its summit.
	 */
	const layers = (): [SVGElement | null, number][] => [
		[grid_el, SEA_LEVEL - 0.15],
		[coast_el, SEA_LEVEL],
		[water_el, SEA_LEVEL],
		...RELIEF.map(({ level }, i): [SVGElement | null, number] => [relief_els[i] ?? null, altitude(level)]),
		[near_el, SEA_LEVEL + 0.02],
		[marks_el, SEA_LEVEL + 0.02],
		[cloud_el, altitude(1085)],
		[summit_el, altitude(1085)]
	];

	/**
	 * Live sky over the city. Everything here is read on the client after mount:
	 * the server has no clock worth trusting for the visitor, no visitor time
	 * zone, and no business calling a weather API on every render.
	 *
	 * The sun lights the model the way it lights the mountain right now. Each
	 * terrace casts a flat, hard-edged copy of itself away from the sun, so the
	 * steps read as steps; low sun, long shadow. A copy and not an SVG filter:
	 * a filtered layer re-rasterises on every parallax frame, nine of them at
	 * once, and a translated path costs nothing extra to move. The shade is
	 * `--shadow-soft`, which every plate already tunes to read on its own well.
	 */
	const SHADOW_REACH = 2.4; // viewBox units of shadow with the sun on the horizon
	const SUN_EVERY = 5 * 60_000; // ms between re-sightings; shadows creep, they don't sweep

	let sun = $state<SunPosition | null>(null);
	let wind = $state<Wind | null>(null);
	let signal = $state<Signal>(null);
	/** Ambient loops allowed: fixed at mount, like the rest of the decoration. */
	let drift = $state(false);

	/** Past civil dusk the streetlights are on and the relief has gone flat. */
	const night = $derived(sun !== null && sun.altitude < CIVIL_DUSK);

	/** Offset of every terrace's shadow, or null while the sun is under the horizon. */
	const shade = $derived.by(() => {
		if (!sun || sun.altitude <= 0) return null;
		const reach = SHADOW_REACH * (1 - sun.altitude / 90);
		const a = (sun.azimuth * Math.PI) / 180;
		// Azimuth runs clockwise from north, and north is up the plate: the sun
		// sits along (sin a, −cos a), so the shadow falls the other way.
		return `translate(${(-Math.sin(a) * reach).toFixed(2)} ${(Math.cos(a) * reach).toFixed(2)})`;
	});

	/** Strong south-easter: the cloud is on the table. */
	const tablecloth = $derived(wind !== null && isCapeDoctor(wind));

	const sun_text = $derived(
		!sun ? '--' : night ? 'NIGHT' : `${Math.round(sun.azimuth) % 360}° / ${Math.round(sun.altitude)}°`
	);
	const wind_text = $derived(
		!wind
			? '--'
			: `${tablecloth ? 'CAPE DOCTOR' : compassPoint(wind.from)} ${Math.round(wind.speed)} KM/H`
	);
	// A time zone is a city, not a fix: round to the nearest ten and say so.
	const signal_text = $derived(
		signal === 'local'
			? 'LOCAL'
			: signal
				? `~${(Math.round(signal.km / 10) * 10).toLocaleString('en-US')} KM ${Math.round(signal.bearing) % 360}°`
				: ''
	);

	/**
	 * Tablecloth, drawn at the summit: a cap of cloud lying along the plateau,
	 * and tongues spilling off its north face towards the city. Puffs are
	 * `[x, y, r]`; the cap's are in its own frame, turned to lie along the
	 * 1000 m terrace (64.5,106 → 72,109).
	 */
	const CAP: [number, number, number][] = [
		[-5.2, 0.6, 2],
		[-3, -0.6, 2.5],
		[-0.4, -1.1, 2.8],
		[2.4, -0.8, 2.6],
		[4.8, 0.2, 2.1],
		[-1.6, 1.2, 2.3],
		[1.4, 1.3, 2.3],
		[3.8, 1.4, 1.7]
	];
	/** Where each tongue leaves the north edge, and its puffs relative to that. */
	const TONGUES: [number, number][] = [
		[65.5, 105.4],
		[68.3, 105.9],
		[71, 106.5]
	];
	const TONGUE_PUFFS: [number, number, number][] = [
		[0, -0.8, 1.7],
		[-0.5, -2.6, 1.3]
	];
	const POUR = 6; // s for one tongue to slide off the edge and burn away

	/**
	 * Cloud white. The plate's metal highlight is the brightest thing each plate
	 * defines — white on paper, phosphor on phosphor — where `--panel` is darker
	 * than the high terraces on every dark plate. Cut with the well so it sits in
	 * the map instead of glaring off it.
	 */
	const CLOUD = 'color-mix(in srgb, var(--hw-metal-hi) 65%, var(--panel-sunk))';

	onMount(() => {
		const sight = () => {
			sun = sunPosition(new Date(), CAPE_TOWN.lat, CAPE_TOWN.lon);
		};
		sight();
		const clock = setInterval(sight, SUN_EVERY);

		signal = signalFrom(Intl.DateTimeFormat().resolvedOptions().timeZone ?? '');
		drift = motionEnabled();

		// One reading per visit; a failure just leaves the row at `--`.
		const ask = new AbortController();
		void fetchWind(ask.signal).then((reading) => {
			if (!ask.signal.aborted) wind = reading;
		});

		return () => {
			clearInterval(clock);
			ask.abort();
		};
	});

	const cursor = { zoom: 0, nx: 0, ny: 0 };
	let hover: { cancel: () => void } | undefined;

	function parallax() {
		const { zoom, nx, ny } = cursor;
		for (const [el, depth] of layers()) {
			if (!el) continue;
			const dx = -nx * SHIFT * depth * zoom;
			const dy = -ny * SHIFT * depth * zoom;
			const scale = 1 + zoom * ZOOM * depth;
			// p ↦ pivot + shift + scale·(p − pivot): zoom about the map's centre,
			// then pull the layer towards the cursor-opposite side by its depth.
			el.setAttribute(
				'transform',
				`translate(${(PIVOT_X + dx).toFixed(2)} ${(PIVOT_Y + dy).toFixed(2)}) scale(${scale.toFixed(4)}) translate(${-PIVOT_X} ${-PIVOT_Y})`
			);
		}
	}

	const clamp_unit = (v: number) => Math.max(-1, Math.min(1, v));

	function onMapEnter(event: PointerEvent) {
		if (event.pointerType !== 'mouse' || reducedMotion()) return;
		hover?.cancel();
		hover = animate(cursor, { zoom: 1, duration: PANEL, ease: EASE_SNAP, onUpdate: parallax });
	}

	function onMapMove(event: PointerEvent) {
		if (event.pointerType !== 'mouse' || !plate || reducedMotion()) return;
		const rect = plate.getBoundingClientRect();
		cursor.nx = clamp_unit(((event.clientX - rect.left) / rect.width) * 2 - 1);
		cursor.ny = clamp_unit(((event.clientY - rect.top) / rect.height) * 2 - 1);
		parallax();
	}

	function onMapLeave(event: PointerEvent) {
		if (event.pointerType !== 'mouse') return;
		hover?.cancel();
		// Recentre as it un-zooms: the offsets are scaled by the zoom, so the
		// layers drift home instead of snapping.
		cursor.nx = 0;
		cursor.ny = 0;
		hover = animate(cursor, { zoom: 0, duration: PANEL, ease: EASE_SNAP, onUpdate: parallax });
	}

	/**
	 * Tilt parallax for touch screens. A tap arms it; the phone's attitude at
	 * that moment is "level", and tilting away from it pulls the layers exactly
	 * as the cursor would. Orientation (`deviceorientation`, gyro-fused on every
	 * platform that has it) beats raw `devicemotion`: it reports angles, not
	 * accelerations, so no integration and no gravity to subtract.
	 *
	 * iOS 13+ gates the event behind `requestPermission()`, which must run inside
	 * the tap itself. Browsers that lack the event, refuse permission, or expose
	 * it without a sensor behind it (desktop Chromium, insecure origins) fall back
	 * to the tap point: the plate zooms and leans towards where it was touched.
	 */
	const TILT_RANGE = 20; // degrees of tilt for a full-edge shift
	const TILT_SMOOTH = 0.18; // per-frame approach towards the sensor target
	const LEVEL_DRIFT = 0.004; // per-reading pull of "level" towards the hold
	const SENSOR_GRACE = 800; // ms to wait for a first reading before giving up

	type OrientationCtor = typeof DeviceOrientationEvent & {
		requestPermission?: () => Promise<'granted' | 'denied'>;
	};

	let tilting = false;
	let last_pointer = '';
	/** Sensor verdict for this page: unknown until the first tap asks. */
	let sensor: 'unknown' | 'live' | 'none' = 'unknown';
	let level: { beta: number; gamma: number } | null = null;
	const target = { nx: 0, ny: 0 };
	let frame = 0;
	let grace: ReturnType<typeof setTimeout> | undefined;

	/** Screen rotation in degrees, so "tilt right" stays right in landscape. */
	const screen_angle = () => screen.orientation?.angle ?? (window.orientation || 0);

	function onOrientation(event: DeviceOrientationEvent) {
		if (event.beta === null || event.gamma === null) return;
		if (sensor !== 'live') {
			sensor = 'live';
			clearTimeout(grace);
		}
		if (!level) level = { beta: event.beta, gamma: event.gamma };
		// Let "level" creep towards however the phone is being held, so a
		// settled new grip recentres instead of pinning the plate to one side.
		level.beta += (event.beta - level.beta) * LEVEL_DRIFT;
		level.gamma += (event.gamma - level.gamma) * LEVEL_DRIFT;
		const db = event.beta - level.beta;
		const dg = event.gamma - level.gamma;
		// Device axes → screen axes: gamma is left/right, beta is towards/away.
		const a = (screen_angle() * Math.PI) / 180;
		const cos = Math.cos(a);
		const sin = Math.sin(a);
		target.nx = clamp_unit((dg * cos + db * sin) / TILT_RANGE);
		target.ny = clamp_unit((db * cos - dg * sin) / TILT_RANGE);
	}

	function follow() {
		cursor.nx += (target.nx - cursor.nx) * TILT_SMOOTH;
		cursor.ny += (target.ny - cursor.ny) * TILT_SMOOTH;
		parallax();
		frame = requestAnimationFrame(follow);
	}

	async function sensorAllowed(): Promise<boolean> {
		if (sensor === 'none' || !window.isSecureContext) return false;
		const ctor = window.DeviceOrientationEvent as OrientationCtor | undefined;
		if (!ctor) return false;
		if (typeof ctor.requestPermission !== 'function') return true;
		try {
			return (await ctor.requestPermission()) === 'granted';
		} catch {
			return false;
		}
	}

	/** Stop the sensor path and lean towards `(nx, ny)` from the tap instead. */
	function leanTo(nx: number, ny: number) {
		window.removeEventListener('deviceorientation', onOrientation);
		cancelAnimationFrame(frame);
		hover?.cancel();
		hover = animate(cursor, {
			zoom: 1,
			nx,
			ny,
			duration: PANEL,
			ease: EASE_SNAP,
			onUpdate: parallax
		});
	}

	async function startTilt(event: MouseEvent) {
		tilting = true;
		const rect = plate!.getBoundingClientRect();
		const tap_x = clamp_unit(((event.clientX - rect.left) / rect.width) * 2 - 1);
		const tap_y = clamp_unit(((event.clientY - rect.top) / rect.height) * 2 - 1);

		// Must be the first await: iOS only honours the prompt inside the gesture.
		const allowed = await sensorAllowed();
		if (!tilting) return; // toggled off while the prompt was up
		if (!allowed) {
			sensor = 'none';
			leanTo(tap_x, tap_y);
			return;
		}

		level = null;
		target.nx = target.ny = 0;
		hover?.cancel();
		hover = animate(cursor, { zoom: 1, duration: PANEL, ease: EASE_SNAP });
		window.addEventListener('deviceorientation', onOrientation);
		frame = requestAnimationFrame(follow);
		if (sensor === 'unknown') {
			grace = setTimeout(() => {
				if (sensor !== 'unknown' || !tilting) return;
				sensor = 'none';
				leanTo(tap_x, tap_y);
			}, SENSOR_GRACE);
		}
	}

	function stopTilt() {
		if (!tilting) return;
		tilting = false;
		clearTimeout(grace);
		window.removeEventListener('deviceorientation', onOrientation);
		cancelAnimationFrame(frame);
		hover?.cancel();
		hover = animate(cursor, {
			zoom: 0,
			nx: 0,
			ny: 0,
			duration: PANEL,
			ease: EASE_SNAP,
			onUpdate: parallax
		});
	}

	function onMapDown(event: PointerEvent) {
		last_pointer = event.pointerType;
	}

	function onMapTap(event: MouseEvent) {
		// Mouse has hover; only touch and pen toggle. A scroll gesture cancels the
		// pointer and never produces a click, so swiping past the map is safe.
		if (last_pointer === 'mouse' || last_pointer === '' || !plate || reducedMotion()) return;
		if (tilting) stopTilt();
		else void startTilt(event);
	}

	onMount(() => {
		if (!plate) return;
		// Scrolled away: stand down, so the sensor isn't left running unseen.
		const seen = new IntersectionObserver(([entry]) => {
			if (!entry.isIntersecting) stopTilt();
		});
		seen.observe(plate);
		return () => {
			seen.disconnect();
			clearTimeout(grace);
			cancelAnimationFrame(frame);
			window.removeEventListener('deviceorientation', onOrientation);
		};
	});

	onDestroy(() => hover?.cancel());

	/** Grow the network to fraction `p` of its full reach, 0 → 1. */
	function paint(p: number) {
		const reach = Math.max(0, Math.min(1, p)) * net_length;
		let drawn = 0;
		spans.forEach(({ start, length }, i) => {
			const d = Math.max(0, Math.min(length, reach - start));
			road_els[i].style.strokeDashoffset = String(1 - d / length);
			drawn += d;
		});
		net_km = Math.round(drawn * KM_PER_UNIT);
	}

	onMount(() => {
		if (!map) return;
		measure();

		if (reducedMotion()) {
			paint(1);
			return;
		}

		/**
		 * Growth follows the map's own travel: from where it first sits in view
		 * (its load position, or the bottom edge if it loads below the fold) up to
		 * 10% from the top of the viewport. The plate sits high on the page, so the
		 * generic viewport-crossing progress is already past half at load and left
		 * almost nothing to scrub. `REST` keeps the inner-city roads on the plate at
		 * the top of the page.
		 */
		const REST = 0.2;
		const source = map;
		const reach = () => {
			const vh = window.innerHeight;
			const top = source.getBoundingClientRect().top;
			const from = Math.min(top + window.scrollY, vh);
			const to = vh * 0.1;
			const travel = from > to ? (from - top) / (from - to) : 1;
			return REST + (1 - REST) * Math.max(0, Math.min(1, travel));
		};
		const booting = document.documentElement.dataset.boot === 'armed';

		// Grow from the city to the scroll position's reach during power-on; the
		// scroll listener takes over on first movement.
		const proxy = { p: 0 };
		const intro = animate(proxy, {
			p: reach(),
			duration: 900,
			delay: booting ? 240 : 0,
			ease: EASE_SNAP,
			onUpdate: () => paint(proxy.p)
		});

		// `onScrollProgress` reports once synchronously on subscribe; only reads
		// after that are real movement.
		let live = false;
		const stop = onScrollProgress(source, () => {
			if (!live) return;
			intro.cancel();
			paint(reach());
		});
		live = true;

		return () => {
			stop();
			intro.cancel();
		};
	});
</script>

<Panel tag="CARTOGRAPHY_CPT" tag_tone="dim" class="flex h-full flex-col p-3" data-boot="3">
	<!-- Survey plate. The pointer handlers only drive decoration; the SVG inside
	     carries the accessible name. -->
	<div
		bind:this={plate}
		role="presentation"
		class="relative min-h-72 flex-1 overflow-hidden border border-line bg-sunk [@media(pointer:coarse)]:cursor-pointer"
		onpointerenter={onMapEnter}
		onpointermove={onMapMove}
		onpointerleave={onMapLeave}
		onpointerdown={onMapDown}
		onclick={onMapTap}
	>
		<!-- `meet` keeps the whole survey frame in view at any plate shape; land, sea
		     and graticule run well past the frame, so the letterbox bands fill with
		     real map instead of blank plate. -->
		<svg
			bind:this={map}
			viewBox="0 0 353 296"
			preserveAspectRatio="xMidYMid meet"
			class="absolute inset-0 h-full w-full"
			role="img"
			aria-label="Survey of the Cape Peninsula and the main roads out of Cape Town"
		>
			<defs>
				<pattern id="cpt-hatch" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
					<line x1="0" y1="0" x2="0" y2="3" stroke="var(--line)" stroke-width="0.8" />
				</pattern>
				<!-- Streetlights: the roads' own light, spread and laid under them twice
				     so the halo carries at plate size. Only applied after dusk. -->
				<filter id="cpt-lamps" x="-5%" y="-5%" width="110%" height="110%">
					<feGaussianBlur in="SourceGraphic" stdDeviation="1.4" result="halo" />
					<feMerge>
						<feMergeNode in="halo" />
						<feMergeNode in="halo" />
						<feMergeNode in="SourceGraphic" />
					</feMerge>
				</filter>
			</defs>

			<!-- Graticule, 0.1° -->
			<g bind:this={grid_el}>
				<g class="stroke-line" stroke-width="0.6" stroke-dasharray="1.5 3">
					<line x1="-189" y1="-300" x2="-189" y2="580" />
					<line x1="-157.5" y1="-300" x2="-157.5" y2="580" />
					<line x1="-126" y1="-300" x2="-126" y2="580" />
					<line x1="-94.5" y1="-300" x2="-94.5" y2="580" />
					<line x1="-63" y1="-300" x2="-63" y2="580" />
					<line x1="-31.5" y1="-300" x2="-31.5" y2="580" />
					<line x1="0" y1="-300" x2="0" y2="580" />
					<line x1="31.5" y1="-300" x2="31.5" y2="580" />
					<line x1="63" y1="-300" x2="63" y2="580" />
					<line x1="94.5" y1="-300" x2="94.5" y2="580" />
					<line x1="126" y1="-300" x2="126" y2="580" />
					<line x1="157.5" y1="-300" x2="157.5" y2="580" />
					<line x1="189" y1="-300" x2="189" y2="580" />
					<line x1="220.5" y1="-300" x2="220.5" y2="580" />
					<line x1="252" y1="-300" x2="252" y2="580" />
					<line x1="283.5" y1="-300" x2="283.5" y2="580" />
					<line x1="315" y1="-300" x2="315" y2="580" />
					<line x1="346.5" y1="-300" x2="346.5" y2="580" />
					<line x1="378" y1="-300" x2="378" y2="580" />
					<line x1="409.5" y1="-300" x2="409.5" y2="580" />
					<line x1="441" y1="-300" x2="441" y2="580" />
					<line x1="472.6" y1="-300" x2="472.6" y2="580" />
					<line x1="504.1" y1="-300" x2="504.1" y2="580" />
					<line x1="535.6" y1="-300" x2="535.6" y2="580" />
					<line x1="567.1" y1="-300" x2="567.1" y2="580" />
					<line x1="-290" y1="-258.4" x2="665" y2="-258.4" />
					<line x1="-290" y1="-220.4" x2="665" y2="-220.4" />
					<line x1="-290" y1="-182.4" x2="665" y2="-182.4" />
					<line x1="-290" y1="-144.4" x2="665" y2="-144.4" />
					<line x1="-290" y1="-106.4" x2="665" y2="-106.4" />
					<line x1="-290" y1="-68.4" x2="665" y2="-68.4" />
					<line x1="-290" y1="-30.4" x2="665" y2="-30.4" />
					<line x1="-290" y1="7.6" x2="665" y2="7.6" />
					<line x1="-290" y1="45.6" x2="665" y2="45.6" />
					<line x1="-290" y1="83.6" x2="665" y2="83.6" />
					<line x1="-290" y1="121.6" x2="665" y2="121.6" />
					<line x1="-290" y1="159.6" x2="665" y2="159.6" />
					<line x1="-290" y1="197.6" x2="665" y2="197.6" />
					<line x1="-290" y1="235.6" x2="665" y2="235.6" />
					<line x1="-290" y1="273.6" x2="665" y2="273.6" />
					<line x1="-290" y1="311.6" x2="665" y2="311.6" />
					<line x1="-290" y1="349.6" x2="665" y2="349.6" />
					<line x1="-290" y1="387.6" x2="665" y2="387.6" />
					<line x1="-290" y1="425.6" x2="665" y2="425.6" />
					<line x1="-290" y1="463.6" x2="665" y2="463.6" />
					<line x1="-290" y1="501.6" x2="665" y2="501.6" />
					<line x1="-290" y1="539.6" x2="665" y2="539.6" />
				</g>
				<g
					fill="var(--ink-dim)"
					font-family="var(--font-mono)"
					font-size="5"
					opacity="0.8"
					stroke="var(--panel-sunk)"
					stroke-width="2"
					paint-order="stroke"
				>
					<text x="350" y="82.1" text-anchor="end">33°54'S</text>
					<text x="350" y="120.1" text-anchor="end">34°00'S</text>
					<text x="350" y="158.1" text-anchor="end">34°06'S</text>
					<text x="350" y="196.1" text-anchor="end">34°12'S</text>
					<text x="350" y="234.1" text-anchor="end">34°18'S</text>
					<text x="127.5" y="293">18°36'E</text>
					<text x="190.5" y="293">18°48'E</text>
					<text x="253.5" y="293">19°00'E</text>
				</g>
			</g>

			<!-- Land (Natural Earth 1:10m) and Robben Island -->
			<g bind:this={coast_el} fill="url(#cpt-hatch)" stroke="var(--ink-dim)" stroke-width="1" stroke-linejoin="round">
				<path d="M654.5,356.4 L649.4,359.9 L643.7,365.2 L639.1,371.6 L637.1,378.1 L633.7,377 L626.1,379 L613.3,384.6 L589.9,401.6 L581.1,413.6 L585.3,423.8 L585.3,426.1 L580.2,427.5 L572,432.8 L566.8,433.9 L561.9,433.2 L557,431.4 L552.4,428.9 L532.6,414.1 L528,409.4 L522.5,406.5 L471.9,408 L467.4,409.1 L462.2,414.4 L457.8,415.8 L454.4,415 L452.3,412.6 L450.8,410 L449.4,408 L433.5,398.2 L409.4,374 L393.3,364.8 L388.4,361 L383.5,354.9 L377.6,350.3 L370.1,349.3 L362.5,351.5 L356.5,356.4 L353.8,354.3 L351,353.8 L348.3,354.4 L345.6,356.4 L346.7,352.1 L365.5,326.3 L367,322.2 L365.5,311.8 L360.5,299.6 L354.1,288.3 L347.9,280.4 L343.5,277.1 L339.5,276.1 L317.5,280.6 L298.2,279.3 L293.9,278.1 L289.6,273.8 L283.9,263.1 L278.9,259.7 L278.9,257.1 L287,255.6 L290.7,250 L292.8,242.1 L296.1,233.5 L290.6,236.6 L283.2,249.1 L279.9,251.8 L255.8,250.3 L251.7,250.5 L242.6,253.9 L212,259.1 L205.4,263.5 L204.1,266.6 L201.1,267.5 L197.5,266.7 L194.6,264.8 L191.6,260.2 L192,256.5 L194.6,251.8 L192.4,239.3 L192.3,236.3 L193.3,232.1 L194.8,230.3 L196.7,228.9 L198.9,225.7 L201.5,218.2 L201.1,212.7 L196.6,199.8 L196.1,191.9 L198.9,188.4 L203.2,185.3 L207.3,178.7 L194.1,158.5 L189,155.6 L170.3,151 L140.9,148.2 L111.8,149.7 L107.2,151.6 L104.5,153.5 L93.1,158.2 L87.7,162.2 L85.1,164.9 L82.2,168.8 L77.5,173.7 L76.1,176.4 L75.7,181.6 L76.5,185.5 L78.1,187.6 L80.1,189.2 L82.2,191.7 L86.5,207.5 L86.9,211.3 L87.1,214.7 L84.3,239.9 L85.6,247.7 L91,251.8 L85.1,253.6 L77.2,249.5 L69.7,242.6 L65,236.3 L57.4,221.2 L56.4,216.7 L56.7,214.3 L58.2,209.1 L58.5,206.1 L57.9,204.7 L56.6,203.8 L55.1,203.1 L54.2,202.3 L51.2,192.4 L48.6,188.2 L39.5,185.1 L36.6,181.4 L35.9,176.6 L36.8,171.2 L39.1,168.2 L42.1,167.2 L44.5,165.2 L45.6,159.5 L45.8,154.3 L46.4,150.3 L47.7,146.5 L49.9,142.4 L45.3,143.1 L43.4,143.7 L41.1,145.2 L36.6,138.1 L36.2,132.6 L38.8,127.6 L43.4,121.9 L47.8,114.8 L51.2,101.3 L54.2,93.1 L64.4,84.8 L76.6,85.1 L86.7,83.5 L91,69.5 L89.6,62.3 L83.5,52.4 L82.2,47.5 L81.4,40 L73,6.3 L64.8,-10.3 L63,-17.7 L60.2,-19.2 L45.6,-37.1 L40.4,-40.5 L37.9,-42.8 L36.8,-46.2 L36.8,-61.8 L36,-69.7 L33.8,-76.3 L26.1,-89.2 L17.1,-99 L-17,-123.2 L-13.9,-129.6 L-15.7,-137.1 L-23.6,-152 L-27.7,-162.1 L-35.4,-172.6 L-36.3,-176.6 L-39.3,-181.5 L-53.8,-195.7 L-59.1,-198.6 L-65.6,-201.3 L-70,-207.4 L-73.5,-214.4 L-77.2,-219.6 L-69.2,-223.7 L-64.5,-224.9 L-61.2,-223.5 L-58.7,-219.2 L-57,-215.1 L-54.8,-211.5 L-51.2,-209 L-52.6,-204.9 L-50.3,-201.7 L-41.7,-194.7 L-35.9,-186.4 L-31.8,-182 L-27.7,-180.5 L-22.9,-183.4 L-24.1,-187.7 L-30.9,-194.7 L-32.6,-197.9 L-33.2,-204.3 L-34.2,-206.9 L-35.5,-207.8 L-39.1,-208.2 L-40.6,-209 L-47.5,-216.1 L-50.1,-219.8 L-51.2,-223.5 L-50.2,-240 L-51.2,-245.6 L-55.7,-253 L-63.2,-256.7 L-72.3,-257.5 L-81.7,-256 L-78.8,-250 L-77.2,-247.9 L-81.1,-247 L-84.3,-245.3 L-90.5,-240.4 L-93.9,-244.4 L-95.8,-248.3 L-96.6,-251.9 L-96.8,-254.5 L-98,-257.8 L-100.2,-261.2 L-101.3,-265.4 L-99.1,-271.3 L-100.6,-274.3 L-104.4,-285.3 L-106.3,-293.7 L693.1,-334.4 L693.1,357.2 Z" />
				<path d="M 57,47.1 C 56.8,46 56.3,44.6 55.7,43.9 C 55.1,43.1 54.3,42.6 53.5,42.4 C 52.8,42.2 52,42.2 51.4,42.7 C 50.9,43.2 50.4,44.2 50.3,45.2 C 50.2,46.2 50.5,47.6 50.9,48.7 C 51.2,49.7 51.7,50.6 52.2,51.5 C 52.8,52.3 53.6,53.7 54.2,53.9 C 54.9,54.1 55.6,53.3 56.1,52.7 C 56.6,52.1 57.1,51.3 57.2,50.4 C 57.3,49.4 57.3,48.2 57,47.1 Z" />
			</g>

			<!-- Water labels lie on the sea, under the terraces -->
			<g bind:this={water_el} fill="var(--ink-dim)" font-family="var(--font-mono)" opacity="0.6">
				<text x="20" y="215" font-size="7" letter-spacing="1.6" transform="rotate(-90 20 215)">ATLANTIC OCEAN</text>
				<text x="120" y="208" font-size="7" letter-spacing="1.6">FALSE BAY</text>
				<text x="86" y="76" font-size="5.5" letter-spacing="1" text-anchor="end">TABLE BAY</text>
			</g>

			<!-- Relief: one filled terrace per contour level, lowest first, each on its
			     own depth plane (see `altitude`). Opaque fills let higher ground
			     cover lower, so the steps show as the layers slide. By day each
			     terrace lays its shadow on the ground below it, riding its own plane
			     so the shadow stays attached to the step that casts it. -->
			<g stroke="var(--ink-dim)" stroke-width="0.4" stroke-opacity="0.55" stroke-linejoin="round" fill-rule="evenodd">
				{#each RELIEF as { level, d }, i (level)}
					<g bind:this={relief_els[i]}>
						{#if shade}<path {d} transform={shade} fill="var(--shadow-soft)" stroke="none" />{/if}
						<path {d} fill={tint(level)} />
					</g>
				{/each}
			</g>

			<!-- The road network (scrubbed by scroll), on the near plane. After dusk
			     it comes on like the city does. -->
			<g
				bind:this={near_el}
				fill="none"
				stroke="var(--accent)"
				stroke-linecap="round"
				stroke-linejoin="round"
				filter={night ? 'url(#cpt-lamps)' : undefined}
			>
				{#each ROADS as road, i (road.name)}
					<path
						bind:this={road_els[i]}
						d={road.d}
						stroke-width={road.major ? 1.75 : 1}
						opacity={road.major ? 1 : 0.8}
						pathLength="1"
						stroke-dasharray="1"
						stroke-dashoffset="1"
					/>
				{/each}
			</g>

			<!-- Points of interest. The plate-coloured halo keeps labels legible over
			     coastline and hatching. -->
			<g
				bind:this={marks_el}
				font-family="var(--font-mono)"
				font-size="6.5"
				fill="var(--ink-dim)"
				stroke="var(--panel-sunk)"
				stroke-width="2.5"
				stroke-linejoin="round"
				paint-order="stroke"
			>
				<circle cx="76.2" cy="18.2" r="1.8" />
				<text x="81.2" y="20.4">MELKBOSSTRAND</text>

				<text x="48.9" y="49.9" text-anchor="end" font-size="5">ROBBEN IS.</text>

				<circle cx="88.8" cy="252.7" r="1.8" />
				<text x="93.8" y="255.7">CAPE POINT</text>

				<circle cx="134.8" cy="96.1" r="1.8" />
				<text x="139.3" y="102.1">UWC</text>

				<circle cx="326.1" cy="278.2" r="1.8" />
				<text x="322.1" y="274.2" text-anchor="end">HERMANUS</text>

				<!-- Home: the city, last so it sits over everything else in the layer -->
				<circle cx="70.6" cy="93.1" r="4.5" fill="none" stroke="var(--accent)" stroke-width="0.75" />
				<circle cx="70.6" cy="93.1" r="2" fill="var(--accent)" stroke-width="1" />
				<text x="77.6" y="91.1" font-size="8" font-weight="700" fill="var(--ink)" letter-spacing="0.8">CAPE TOWN</text>
			</g>

			<!-- The tablecloth: laid by the Cape Doctor, riding the summit's plane.
			     Filled from the plate's own highlight (`CLOUD`), with an ink edge so
			     it still reads where highlight and terrain run close. Every puff is
			     drawn twice, outline then fill, so only the cloud's outer edge keeps
			     its line. -->
			<g bind:this={cloud_el}>
				{#if tablecloth}
					<g class:drift opacity="0.92" stroke="var(--ink-dim)" stroke-opacity="0.6" stroke-width="1.1">
						{#each TONGUES as [x, y], i (i)}
							<g class="tongue" style:animation-delay="{(-i * POUR) / TONGUES.length}s" style:animation-duration="{POUR}s">
								<g fill="none">
									{#each TONGUE_PUFFS as [px, py, r], j (j)}<circle cx={x + px} cy={y + py} {r} />{/each}
								</g>
								<g fill={CLOUD} stroke="none">
									{#each TONGUE_PUFFS as [px, py, r], j (j)}<circle cx={x + px} cy={y + py} {r} />{/each}
								</g>
							</g>
						{/each}
						<g transform="translate(68.2 107.6) rotate(22)">
							<g fill="none">
								{#each CAP as [cx, cy, r], j (j)}<circle {cx} {cy} {r} />{/each}
							</g>
							<g fill={CLOUD} stroke="none">
								{#each CAP as [cx, cy, r], j (j)}<circle {cx} {cy} {r} />{/each}
							</g>
						</g>
					</g>
				{/if}
			</g>

			<!-- Table Mountain's summit (Maclear's Beacon), riding its own height -->
			<g
				bind:this={summit_el}
				font-family="var(--font-mono)"
				font-size="6.5"
				fill="var(--ink-dim)"
				stroke="var(--panel-sunk)"
				stroke-width="2.5"
				stroke-linejoin="round"
				paint-order="stroke"
			>
				<path d="M 69,105 L 72,110 L 66,110 Z" stroke-width="1" />
				<text x="64" y="109" text-anchor="end" letter-spacing="0.6">TABLE MT.</text>
				<text x="64" y="115.5" text-anchor="end" font-size="5">1085m</text>
			</g>

			<!-- Scale bar: 10 km at this projection. Outside the parallax stack — the
			     ruler stays on the glass. -->
			<g font-family="var(--font-mono)" font-size="5" fill="var(--ink-dim)">
				<text x="8" y="282">10 KM</text>
				<rect x="8" y="285" width="34.1" height="2.5" fill="none" stroke="var(--ink-dim)" stroke-width="0.6" />
				<rect x="8" y="285" width="17.1" height="2.5" fill="var(--ink)" />
			</g>
		</svg>

		<!-- Glass: readouts sit above the map and never move with it. The ink tick
		     on the rose points the way the visitor's signal came in from. -->
		<div
			class="pointer-events-none absolute top-2 left-2 flex h-6 w-6 items-center justify-center rounded-full border border-line bg-sunk"
			aria-hidden="true"
		>
			<div class="absolute h-4 w-0.5 bg-line"></div>
			{#if signal && signal !== 'local'}
				<div class="absolute inset-0" style:rotate="{signal.bearing.toFixed(1)}deg">
					<div class="absolute top-0.5 left-1/2 h-[9px] w-px -translate-x-1/2 bg-ink"></div>
				</div>
			{/if}
			<div
				class="absolute top-1 h-0 w-0 border-r-[2px] border-b-[4px] border-l-[2px] border-r-transparent border-b-accent border-l-transparent"
			></div>
			<span class="absolute -top-1.5 text-pico font-bold text-accent">N</span>
		</div>

		<dl
			class="pointer-events-none absolute top-2 right-2 grid grid-cols-[auto_auto] gap-x-2 border border-line bg-sunk px-1.5 py-1 font-mono text-nano leading-snug text-dim"
		>
			<dt>LAT/LON</dt><dd class="text-ink">33.9249°S 18.4241°E</dd>
			<dt>DATUM</dt><dd class="text-ink">WGS84 · TM</dd>
			<dt>ROADS</dt><dd class="text-ink"><Readout value={net_km} pad={3} suffix=" KM" /></dd>
			<dt>SUN</dt><dd class="text-ink">{sun_text}</dd>
			<dt>WIND</dt><dd class="text-ink">{wind_text}</dd>
			{#if signal}<dt>SIGNAL</dt><dd class="text-ink">{signal_text}</dd>{/if}
		</dl>
	</div>
</Panel>

<style>
	/*
		The tablecloth pours: tongues slide off the north face towards the city
		and burn off as they drop, the way the real one evaporates into the
		warmer air below. This is weather, not a control, so it runs on its own
		slow linear clock like the tape reels instead of the panel curves, and
		holds still, tongues out, when motion is off.
	*/
	.drift .tongue {
		animation-name: pour;
		animation-timing-function: linear;
		animation-iteration-count: infinite;
	}
	@keyframes pour {
		0% {
			transform: translate(0, 0);
			opacity: 0;
		}
		15% {
			opacity: 1;
		}
		100% {
			transform: translate(-1.2px, -5px);
			opacity: 0;
		}
	}
</style>
