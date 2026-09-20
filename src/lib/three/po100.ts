import {
	BoxGeometry,
	CanvasTexture,
	CatmullRomCurve3,
	CircleGeometry,
	Color,
	CylinderGeometry,
	DataTexture,
	DirectionalLight,
	Group,
	HemisphereLight,
	LinearFilter,
	MathUtils,
	Mesh,
	MeshBasicMaterial,
	MeshToonMaterial,
	NearestFilter,
	PerspectiveCamera,
	PlaneGeometry,
	RedFormat,
	SRGBColorSpace,
	Scene,
	TorusGeometry,
	TubeGeometry,
	Vector3,
	WebGLRenderer
} from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import type { Texture } from 'three';
import { animate, cubicBezier, spring } from 'animejs';
import type { PoMode } from '$lib/components/ProfilePhoto.svelte';

/**
 * The PO-100 as a real object — one WebGL moment, built from primitives, cheap by
 * construction.
 *
 * This whole module is the lazy boundary: nothing static imports it, so its named
 * three imports (which tree-shake, unlike a namespace import) land in a chunk that is
 * fetched only when Po100.svelte decides to. The layout is measured from the 2D
 * module's own DOM, so the model shares the control panel's geometry and a click that
 * looks like it lands on a 3D key actually lands on the 2D key underneath.
 *
 * Everything downstream is colour from faceplate tokens (read from
 * `document.documentElement`) and flat toon shading — printed, industrial, no PBR, no
 * bloom, no post chain.
 */

/** Fractional geometry of a measured element, relative to the module box. */
interface Frac {
	cx: number;
	cy: number;
	left: number;
	top: number;
	w: number;
	h: number;
}

export interface PoLayout {
	slotW: number;
	slotH: number;
	screen: Frac;
	grill: Frac;
	strip: Frac;
	header: Frac;
	buttons: Frac[];
	knobs: Frac[];
}

export interface Po3dApi {
	setMode: (mode: PoMode) => Promise<void>;
	setKnob: (index: number, value: number) => void;
	/** The charging cable: plugged in or not, and the level its LED reports. */
	setCharging: (on: boolean, level: number | null) => void;
	setContextLostHandler: (fn: () => void) => void;
	dispose: () => void;
}

const PORTRAIT = '/images/profile-instagram.jpg';
const GB_TONES = [
	[0x0f, 0x38, 0x0f],
	[0x30, 0x62, 0x30],
	[0x8b, 0xac, 0x0f],
	[0x9b, 0xbc, 0x0f]
] as const;
const MODE_LABELS = ['LCD', 'CRT', 'GB', 'DM', 'NOR'];
const KNOB_LABELS = ['FREQ', 'PHAS', 'RGB'];
const KNOB_TOKEN_KEYS = ['--hw-knob-freq', '--hw-knob-phase', '--hw-knob-rgb'];

interface Tokens {
	case_: string;
	case2: string;
	caseLine: string;
	well: string;
	well2: string;
	screw: string;
	key: string;
	keyLine: string;
	ink: string;
	dim: string;
	panel: string;
	rec: string;
	ok: string;
	knobs: string[];
}

/** Faceplate tokens, resolved to concrete colour strings. */
function readTokens(): Tokens {
	const s = getComputedStyle(document.documentElement);
	const pick = (name: string) => s.getPropertyValue(name).trim();
	/** A token may hold a gradient (knob caps): take the bright end for a solid cap colour. */
	const solid = (name: string) => {
		const value = pick(name);
		const hexes = value.match(/#[0-9a-fA-F]{3,8}/g);
		return hexes ? hexes[hexes.length - 1] : value;
	};
	return {
		case_: pick('--hw-case'),
		case2: pick('--hw-case-2'),
		caseLine: pick('--hw-case-line'),
		well: pick('--hw-well'),
		well2: pick('--hw-well-2'),
		screw: pick('--hw-screw'),
		key: pick('--hw-key'),
		keyLine: pick('--hw-key-line'),
		ink: pick('--ink'),
		dim: pick('--ink-dim'),
		panel: pick('--panel'),
		rec: pick('--rec'),
		ok: pick('--ok'),
		knobs: KNOB_TOKEN_KEYS.map(solid)
	};
}

function loadImage(src: string): Promise<HTMLImageElement> {
	const { promise, resolve, reject } = Promise.withResolvers<HTMLImageElement>();
	const img = new Image();
	img.onload = () => resolve(img);
	img.onerror = () => reject(new Error('portrait failed to load'));
	img.src = src;
	return promise;
}

/**
 * One canvas per display mode, computed once at init. Pixel remapping by hand rather
 * than `ctx.filter`, because the filter string is not supported everywhere and this is
 * deterministic.
 */
function buildScreenCanvas(mode: PoMode, img: HTMLImageElement): HTMLCanvasElement {
	const size = 192;
	const c = document.createElement('canvas');
	c.width = c.height = size;
	const ctx = c.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;
	ctx.drawImage(img, 0, 0, size, size);

	const data = ctx.getImageData(0, 0, size, size);
	const px = data.data;
	for (let i = 0; i < px.length; i += 4) {
		const lum = 0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2];
		let r = lum,
			g = lum,
			b = lum;
		if (mode === 'LCD') {
			r = lum * 0.45;
			g = Math.min(255, lum * 1.06);
			b = lum * 0.55;
		} else if (mode === 'CRT') {
			r = Math.min(255, lum * 0.55 + 20);
			g = Math.min(255, lum * 0.88 + 16);
			b = Math.min(255, lum + 26);
		} else if (mode === 'GAMEBOY') {
			const tone = GB_TONES[Math.min(3, Math.floor((lum / 256) * 4))];
			[r, g, b] = [tone[0], tone[1], tone[2]];
		} else if (mode === 'DOT_MATRIX') {
			r = Math.min(255, lum * 1.45 + 12);
			g = lum * 0.6;
			b = lum * 0.2;
		}
		px[i] = r;
		px[i + 1] = g;
		px[i + 2] = b;
	}
	ctx.putImageData(data, 0, 0);

	if (mode === 'LCD' || mode === 'CRT') {
		ctx.fillStyle = 'rgba(0,0,0,0.2)';
		for (let y = 0; y < size; y += 3) ctx.fillRect(0, y, size, 1);
	}
	if (mode === 'CRT') {
		const vg = ctx.createRadialGradient(size / 2, size / 2, size * 0.42, size / 2, size / 2, size * 0.74);
		vg.addColorStop(0, 'rgba(0,0,0,0)');
		vg.addColorStop(1, 'rgba(0,0,0,0.42)');
		ctx.fillStyle = vg;
		ctx.fillRect(0, 0, size, size);
	}
	if (mode === 'GAMEBOY') {
		ctx.fillStyle = 'rgba(15,56,15,0.14)';
		for (let y = 0; y < size; y += 2) ctx.fillRect(0, y, size, 1);
	}
	if (mode === 'DOT_MATRIX') {
		ctx.fillStyle = 'rgba(0,0,0,0.45)';
		for (let y = 1; y < size; y += 3) for (let x = 1; x < size; x += 3) ctx.fillRect(x, y, 1, 1);
	}
	return c;
}

/**
 * Build and run the scene. Returns null when WebGL is unavailable, and the 2D module
 * carries on as it always has.
 */
export async function initPo3d(
	canvas: HTMLCanvasElement,
	slot: HTMLElement,
	layout: PoLayout,
	initial: { mode: PoMode; knobs: [number, number, number] },
	onReady: (api: Po3dApi) => void
): Promise<Po3dApi | null> {
	/* ── Context ──────────────────────────────────────────────────────────── */

	let renderer: WebGLRenderer;
	try {
		renderer = new WebGLRenderer({
			canvas,
			antialias: true,
			alpha: false,
			powerPreference: 'high-performance'
		});
	} catch (err) {
		console.info('PO-100 3D: WebGL unavailable, keeping the 2D module.', (err as Error)?.message ?? err);
		return null;
	}
	renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

	const scene: Scene = new Scene();
	const camera = new PerspectiveCamera(30, 1, 0.1, 60);
	camera.position.set(0, 0.1, 9);

	/* ── Materials ────────────────────────────────────────────────────────── */

	// Quantized three-step gradient → the toon bands read printed, not rendered.
	const gradientMap = new DataTexture(new Uint8Array([112, 184, 255]), 3, 1, RedFormat);
	gradientMap.minFilter = NearestFilter;
	gradientMap.magFilter = NearestFilter;
	gradientMap.needsUpdate = true;

	let tokens = readTokens();

	const disposables: { dispose: () => void }[] = [];
	const track = <T extends { dispose: () => void }>(d: T): T => (disposables.push(d), d);

	const toon = (color: string | number): MeshToonMaterial =>
		track(new MeshToonMaterial({ color: new Color(color), gradientMap }));
	const flat = (color: string | number): MeshBasicMaterial =>
		track(new MeshBasicMaterial({ color: new Color(color) }));

	/* ── The device ───────────────────────────────────────────────────────── */

	const device = new Group();
	scene.add(device);

	// Proportions follow the 2D module's own box, not an invented silhouette.
	const W = 2.2;
	const H = W * (layout.slotH / layout.slotW);
	const D = 0.34;
	const F = D / 2 + 0.001;

	// Fractional-position helpers: measured DOM fractions → model coordinates.
	const px = (f: number) => (f - 0.5) * W;
	const py = (f: number) => (0.5 - f) * H;
	const pw = (f: number) => f * W;
	const ph = (f: number) => f * H;

	const body = new Mesh(track(new RoundedBoxGeometry(W, H, D, 3, 0.05)), toon(tokens.case_));
	device.add(body);

	// Screen: bezel box slightly proud of the face, portrait plane on top of it — the
	// visible bezel is the margin the box sticks out around the screen.
	const bezel = new Mesh(
		track(new BoxGeometry(pw(layout.screen.w) + 0.1, ph(layout.screen.h) + 0.1, 0.06)),
		toon(tokens.well)
	);
	bezel.position.set(px(layout.screen.cx), py(layout.screen.cy), F + 0.018);
	device.add(bezel);

	const screenMat = track(new MeshBasicMaterial({ color: 0x000000 }));
	const screen = new Mesh(
		track(new PlaneGeometry(pw(layout.screen.w), ph(layout.screen.h))),
		screenMat
	);
	screen.position.set(px(layout.screen.cx), py(layout.screen.cy), F + 0.018 + 0.034);
	device.add(screen);

	// Screen textures, one per mode, computed once.
	const textures = new Map<PoMode, Texture>();
	async function ensureTexture(mode: PoMode): Promise<Texture> {
		const hit = textures.get(mode);
		if (hit) return hit;
		const img = await loadImage(PORTRAIT);
		const cnv = buildScreenCanvas(mode, img);
		const tex = track(new CanvasTexture(cnv));
		tex.colorSpace = SRGBColorSpace;
		tex.minFilter = LinearFilter;
		tex.magFilter = NearestFilter;
		textures.set(mode, tex);
		return tex;
	}

	const ledOn = flat('#000000');
	const ledOff = flat('#000000');

	const buttons = layout.buttons.map((b) => {
		const g = new Group();
		const cap = new Mesh(
			track(new CylinderGeometry(pw(b.w) / 2, (pw(b.w) / 2) * 1.04, 0.09, 20)),
			toon(tokens.key)
		);
		cap.rotation.x = Math.PI / 2;
		cap.position.z = 0.045;
		g.add(cap);

		const led = new Mesh(track(new CircleGeometry(0.026, 12)), ledOff);
		led.position.set(0, -pw(b.w) * 1.05, 0.002);
		g.add(led);

		g.position.set(px(b.cx), py(b.cy), F);
		device.add(g);
		return { led, cap };
	});

	// Knobs: a cap and a pointer line on its face, so the rotation reads.
	const knobs = layout.knobs.map((k, i) => {
		const g = new Group();
		const cap = new Mesh(
			track(new CylinderGeometry((pw(k.w) / 2) * 0.94, pw(k.w) / 2, 0.11, 24)),
			toon(tokens.knobs[i])
		);
		cap.rotation.x = Math.PI / 2;
		cap.position.z = 0.055;
		g.add(cap);

		const pointer = new Mesh(
			track(new BoxGeometry(0.02, pw(k.w) * 0.4, 0.012)),
			flat(tokens.well2)
		);
		pointer.position.set(0, pw(k.w) * 0.3, 0.112);
		g.add(pointer);

		g.position.set(px(k.cx), py(k.cy), F);
		device.add(g);
		return { group: g };
	});

	// Corner screws: flattened cylinder + a dark slot across the face.
	const screwAngles = [0.78, -0.52, 1.05, 0.26];
	const screws: Mesh[] = [];
	(
		[
			[-1, 1],
			[1, 1],
			[-1, -1],
			[1, -1]
		] as const
	).forEach(([sx, sy], i) => {
		const g = new Group();
		const head = new Mesh(track(new CylinderGeometry(0.032, 0.032, 0.016, 16)), toon(tokens.screw));
		head.rotation.x = Math.PI / 2;
		head.position.z = 0.008;
		g.add(head);
		const slotCut = new Mesh(track(new BoxGeometry(0.042, 0.007, 0.004)), flat(tokens.well2));
		slotCut.position.z = 0.018;
		slotCut.rotation.z = screwAngles[i % 4];
		g.add(slotCut);
		g.position.set(sx * (W / 2 - 0.055), sy * (H / 2 - 0.055), F);
		device.add(g);
		screws.push(head);
	});

	// Speaker grille: rows of tiny dark dots — deliberately not spending geometry here.
	for (let gy = 0; gy < 3; gy++) {
		for (let gx = 0; gx < 4; gx++) {
			const dot = new Mesh(track(new CircleGeometry(0.011, 8)), flat(tokens.well2));
			dot.position.set(
				px(layout.grill.cx) + (gx - 1.5) * 0.06,
				py(layout.grill.cy) + (gy - 1) * 0.06,
				F + 0.002
			);
			device.add(dot);
		}
	}

	// Bottom strip: the divider line, the OUT jack, the USB-C port.
	const strip = new Mesh(track(new BoxGeometry(W * 0.92, 0.01, 0.008)), flat(tokens.caseLine));
	strip.position.set(px(layout.strip.cx), py(layout.strip.cy) - ph(layout.strip.h) * 0.18, F + 0.002);
	device.add(strip);

	const jack = new Mesh(track(new TorusGeometry(0.042, 0.012, 8, 20)), toon(tokens.well2));
	jack.position.set(px(layout.strip.cx) - W * 0.4, py(layout.strip.cy), F + 0.006);
	device.add(jack);

	const port = new Mesh(track(new BoxGeometry(0.1, 0.03, 0.016)), flat(tokens.well2));
	port.position.set(px(layout.strip.cx) + W * 0.4, py(layout.strip.cy), F + 0.006);
	device.add(port);

	/*
		The charging cable — the 2D module's easter egg, as an object.

		Same anatomy as the 2D one: a collar in the port, the connector shell with its
		LED (green at full, blinking red while it fills), a strain relief, and the lead
		running out of frame. It hangs off the device, so it lives in `device` and tilts
		with it, and it is only ever present while the machine reports charging.
	*/
	const portX = px(layout.strip.cx) + W * 0.4;
	const portY = py(layout.strip.cy);

	const plug = new Group();
	plug.position.set(portX, portY, F);
	plug.visible = false;
	device.add(plug);

	const cableMat = toon(tokens.screw);

	const collar = new Mesh(track(new BoxGeometry(0.09, 0.028, 0.05)), cableMat);
	collar.position.set(0, -0.02, 0.03);
	plug.add(collar);

	// The 2D shell is separated from the case by a dark border; in three that has to be
	// geometry, so the housing sits a hair proud of a darker plate.
	const shellRim = new Mesh(track(new BoxGeometry(0.215, 0.195, 0.09)), flat(tokens.well2));
	shellRim.position.set(0, -0.12, 0.05);
	plug.add(shellRim);

	const shell = new Mesh(
		track(new RoundedBoxGeometry(0.19, 0.17, 0.1, 2, 0.018)),
		toon(tokens.case2)
	);
	shell.position.set(0, -0.12, 0.06);
	plug.add(shell);

	const plugLed = new Mesh(track(new CircleGeometry(0.03, 12)), ledOff);
	plugLed.position.set(0, -0.12, 0.113);
	plug.add(plugLed);

	const relief = new Mesh(track(new BoxGeometry(0.07, 0.05, 0.07)), flat(tokens.well2));
	relief.position.set(0, -0.23, 0.06);
	plug.add(relief);

	// One gentle fall away from the case: a cable is not a rod, but it is not a spline
	// show either — four control points and a thin tube.
	const lead = new Mesh(
		track(
			new TubeGeometry(
				new CatmullRomCurve3([
					new Vector3(0, -0.255, 0.06),
					new Vector3(0.02, -0.42, 0.1),
					new Vector3(-0.012, -0.68, 0.07),
					new Vector3(0.008, -0.98, 0.03)
				]),
				14,
				0.016,
				6,
				false
			)
		),
		cableMat
	);
	plug.add(lead);

	const ledCharged = flat('#000000');
	let charging = false;
	let chargeLevel: number | null = null;
	let ledPhase = -1;
	let plugAnim: { cancel: () => void } | null = null;
	// Far enough under the chassis that the plug is off-frame before it is hidden.
	const PLUG_TRAVEL = 0.6;

	/** Plug in, or pull out: 220ms, the same curve panels move on. Never a bounce. */
	function setPlug(on: boolean) {
		if (on === charging) return;
		charging = on;
		plugAnim?.cancel();
		if (on) plug.visible = true;
		const proxy = { y: plug.position.y };
		plugAnim = animate(proxy, {
			y: on ? portY : portY - PLUG_TRAVEL,
			duration: 220,
			ease: cubicBezier(0.2, 0.9, 0.25, 1),
			onUpdate: () => {
				plug.position.y = proxy.y;
			},
			onComplete: () => {
				if (!charging) plug.visible = false;
			}
		});
	}
	plug.position.y = portY - PLUG_TRAVEL;

	/* ── Text plate: one canvas, one texture, one mesh ────────────────────── */

	let textPlate: Mesh | null = null;
	let textTexture: Texture | null = null;
	async function buildTextPlate() {
		await document.fonts.ready;
		const tw = 512;
		const th = Math.round((tw * H) / W);
		const c = document.createElement('canvas');
		c.width = tw;
		c.height = th;
		const ctx = c.getContext('2d') as CanvasRenderingContext2D;
		const t = readTokens();
		const font = (size: number, weight = 700) => `${weight} ${size}px "JetBrains Mono", ui-monospace, monospace`;
		ctx.textBaseline = 'middle';

		// Device header
		ctx.textAlign = 'left';
		ctx.fillStyle = t.ink;
		ctx.font = font(15);
		ctx.fillText('PO-100 / ID-PHOTO', layout.header.left * tw, layout.header.cy * th - 7);
		ctx.fillStyle = t.dim;
		ctx.font = font(10, 400);
		ctx.fillText('TE_PORTRAIT_ENGINE', layout.header.left * tw, layout.header.cy * th + 8);

		// Key labels under the row of keys
		ctx.textAlign = 'center';
		ctx.font = font(11);
		ctx.fillStyle = t.dim;
		layout.buttons.forEach((b, i) => {
			ctx.fillText(MODE_LABELS[i], b.cx * tw, (b.cy + b.h * 0.5) * th + 13);
		});

		// Knob labels under the knobs
		ctx.font = font(12);
		ctx.fillStyle = t.ink;
		layout.knobs.forEach((k, i) => {
			ctx.fillText(KNOB_LABELS[i], k.cx * tw, (k.cy + k.h * 0.5) * th + 16);
		});

		// Bottom strip labels
		ctx.font = font(10);
		ctx.fillStyle = t.dim;
		ctx.textAlign = 'left';
		ctx.fillText('OUT', (layout.strip.cx - layout.strip.w * 0.42) * tw, layout.strip.cy * th + 2);
		ctx.textAlign = 'center';
		ctx.fillText('PO-100 OP-IMG', layout.strip.cx * tw, layout.strip.cy * th + 2);
		ctx.textAlign = 'right';
		ctx.fillText('PWR', (layout.strip.cx + layout.strip.w * 0.42) * tw, layout.strip.cy * th + 2);

		textTexture?.dispose();
		textTexture = track(new CanvasTexture(c));
		textTexture.colorSpace = SRGBColorSpace;
		const plate = new Mesh(
			track(new PlaneGeometry(W, H)),
			track(new MeshBasicMaterial({ map: textTexture, transparent: true, depthWrite: false }))
		);
		plate.position.set(0, 0, F + 0.003);
		if (textPlate) device.remove(textPlate);
		device.add(plate);
		textPlate = plate;
	}

	/* ── One soft contact shadow ──────────────────────────────────────────── */

	{
		// One soft shadow, sitting behind the device and offset down-right, in the same
		// direction as every hard offset shadow on the site. Built by stacking rounded
		// rects rather than a blur filter, which is not universally supported.
		const size = 256;
		const c = document.createElement('canvas');
		c.width = c.height = size;
		const ctx = c.getContext('2d') as CanvasRenderingContext2D;
		const steps = 14;
		for (let i = steps; i > 0; i--) {
			const grow = (i / steps) * 42;
			const alpha = 0.03 + (1 - i / steps) * 0.03;
			ctx.fillStyle = `rgba(0,0,0,${alpha})`;
			ctx.beginPath();
			ctx.roundRect(48 - grow, 30 - grow, 160 + grow * 2, 196 + grow * 2, 18 + grow * 0.5);
			ctx.fill();
		}
		const tex = track(new CanvasTexture(c));
		const shadow = new Mesh(
			track(new PlaneGeometry(W * 1.55, H * 1.32)),
			track(new MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false }))
		);
		shadow.position.set(0.07, -0.09, -0.22);
		scene.add(shadow);
	}

	/* ── Lights: toon needs a key light and a soft fill, nothing more ─────── */

	const key = new DirectionalLight(0xffffff, 1.15);
	key.position.set(-2.5, 3.2, 4);
	scene.add(key);
	scene.add(new HemisphereLight(0xffffff, 0x1a1a1a, 0.55));

	/* ── Theming: re-skin on data-theme flips ─────────────────────────────── */

	function applyTheme(t: Tokens) {
		scene.background = new Color(t.panel);
		(body.material as MeshToonMaterial).color.set(t.case_);
		(bezel.material as MeshToonMaterial).color.set(t.well);
		buttons.forEach((b) => (b.cap.material as MeshToonMaterial).color.set(t.key));
		knobs.forEach((k, i) => (k.group.children[0] as Mesh).material && ((k.group.children[0] as Mesh).material as MeshToonMaterial).color.set(t.knobs[i]));
		screws.forEach((s) => (s.material as MeshToonMaterial).color.set(t.screw));
		ledOn.color.set(t.rec);
		ledOff.color.set(t.well2);
		cableMat.color.set(t.screw);
		(shell.material as MeshToonMaterial).color.set(t.case2);
		ledCharged.color.set(t.ok);
	}
	applyTheme(tokens);

	const themeObserver = new MutationObserver(() => {
		tokens = readTokens();
		applyTheme(tokens);
		buildTextPlate();
	});
	themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

	/* ── Camera + renderer sizing ─────────────────────────────────────────── */

	function fit() {
		const w = slot.clientWidth;
		const h = slot.clientHeight;
		if (!w || !h) return;
		renderer.setSize(w, h, false);
		camera.aspect = w / h;
		// A few percent of air around the device: the room the tilt needs, and close
		// enough to the 2D module's box that a click on a 3D key hits the 2D key.
		const neededH = H * 1.08;
		const zH = neededH / 2 / Math.tan(MathUtils.degToRad(camera.fov / 2));
		const zW = (W * 1.1) / 2 / (Math.tan(MathUtils.degToRad(camera.fov / 2)) * camera.aspect);
		camera.position.z = Math.max(zH, zW);
		camera.lookAt(0, 0, 0);
		camera.updateProjectionMatrix();
	}
	fit();
	const resizeObserver = new ResizeObserver(fit);
	resizeObserver.observe(slot);

	/* ── Behaviour: idle drift + pointer tilt, nothing else ───────────────── */

	let tiltX = 0;
	let tiltY = 0;
	let tiltTargetX = 0;
	let tiltTargetY = 0;

	function onMove(e: PointerEvent) {
		const r = slot.getBoundingClientRect();
		tiltTargetY = ((e.clientX - r.x) / r.width - 0.5) * 0.26; // ±7.5°
		tiltTargetX = ((e.clientY - r.y) / r.height - 0.5) * 0.22; // ±6.3°
	}
	function onLeave() {
		tiltTargetX = 0;
		tiltTargetY = 0;
	}
	slot.addEventListener('pointermove', onMove);
	slot.addEventListener('pointerleave', onLeave);

	/* ── Render loop: only while on screen and the tab is visible ─────────── */

	let inView = false;
	let tabVisible = document.visibilityState === 'visible';
	let raf = 0;
	let last = performance.now();
	let t = 0;

	function frame(now: number) {
		raf = 0;
		const dt = Math.min(0.05, (now - last) / 1000);
		last = now;
		t += dt;

		// Idle drift: two sines at different periods — a slow figure-eight.
		device.rotation.x = Math.sin(t * 1.7) * 0.058 + tiltX;
		device.rotation.y = Math.sin(t * 0.9 + 1.3) * 0.068 + tiltY;

		// Heavy damping toward the tilt target; the device eases home when released.
		tiltX += (tiltTargetX - tiltX) * 0.05;
		tiltY += (tiltTargetY - tiltY) * 0.05;

		// The charge LED: solid once full, otherwise a hard 1.6s blink. A diode does
		// not interpolate, so this is a phase flip, not a fade.
		if (plug.visible) {
			const phase = chargeLevel !== null && chargeLevel >= 99 ? 2 : Math.floor(t / 0.8) % 2;
			if (phase !== ledPhase) {
				ledPhase = phase;
				plugLed.material = phase === 2 ? ledCharged : phase === 0 ? ledOn : ledOff;
			}
		}

		renderer.render(scene, camera);

		if (inView && tabVisible) raf = requestAnimationFrame(frame);
	}

	function pump() {
		if (inView && tabVisible && !raf) {
			last = performance.now();
			raf = requestAnimationFrame(frame);
		}
	}

	const io = new IntersectionObserver(
		([entry]) => {
			inView = entry.isIntersecting;
			if (inView) pump();
		},
		{ rootMargin: '100px' }
	);
	io.observe(slot);

	function onVisibility() {
		tabVisible = document.visibilityState === 'visible';
		if (tabVisible) pump();
	}
	document.addEventListener('visibilitychange', onVisibility);

	let onContextLost = () => {};
	function onLost() {
		onContextLost();
		dispose();
	}
	canvas.addEventListener('webglcontextlost', onLost);

	/* ── Wiring to the live control state ─────────────────────────────────── */

	const PO_MODES_INDEX: Record<PoMode, number> = { LCD: 0, CRT: 1, GAMEBOY: 2, DOT_MATRIX: 3, NORMAL: 4 };
	const knobSprings: { cancel: () => void }[] = [];
	// The one place a spring is permitted: a physical object settling into a detent.
	function springKnob(index: number, target: number) {
		knobSprings[index]?.cancel();
		const proxy = { v: knobs[index].group.rotation.z };
		knobSprings[index] = animate(proxy, {
			v: target,
			ease: spring({ stiffness: 180, damping: 14 }),
			onUpdate: () => {
				knobs[index].group.rotation.z = proxy.v;
			}
		});
	}

	const api: Po3dApi = {
		async setMode(mode) {
			const tex = await ensureTexture(mode);
			screenMat.map = tex;
			screenMat.color.set('#ffffff');
			screenMat.needsUpdate = true;
			const idx = PO_MODES_INDEX[mode];
			buttons.forEach((b, i) => {
				b.led.material = i === idx ? ledOn : ledOff;
			});
		},
		setKnob(index, value) {
			if (index < 0 || index >= knobs.length) return;
			springKnob(index, -MathUtils.degToRad((value / 180) * 135));
		},
		setCharging(on, level) {
			chargeLevel = level;
			ledPhase = -1;
			setPlug(on);
		},
		setContextLostHandler(fn) {
			onContextLost = fn;
		},
		dispose
	};

	await api.setMode(initial.mode);
	initial.knobs.forEach((v, i) => api.setKnob(i, v));
	await buildTextPlate();

	inView = true;
	pump();
	renderer.render(scene, camera);
	onReady(api);

	/* ── Full teardown ────────────────────────────────────────────────────── */

	function dispose() {
		if (raf) cancelAnimationFrame(raf);
		raf = 0;
		io.disconnect();
		resizeObserver.disconnect();
		themeObserver.disconnect();
		document.removeEventListener('visibilitychange', onVisibility);
		canvas.removeEventListener('webglcontextlost', onLost);
		slot.removeEventListener('pointermove', onMove);
		slot.removeEventListener('pointerleave', onLeave);
		for (const k of knobSprings) k?.cancel();
		plugAnim?.cancel();
		for (const d of disposables) d.dispose();
		renderer.dispose();
		renderer.forceContextLoss();
	}

	return api;
}
