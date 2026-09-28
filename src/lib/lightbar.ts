import { readonly, writable, type Readable } from 'svelte/store';
import { theme } from '$lib/stores/theme';

/**
 * PlayStation lightbar — a DualShock 4 or DualSense wears the plate's colour.
 *
 * The Gamepad API reads buttons but cannot write LEDs, so this goes through WebHID
 * (Chromium desktop only). The browser grants a HID device only from a click, so the
 * first link is a button press on the PAD 1 badge; after that `getDevices()` hands the
 * pad back on every visit with no prompt, and the bar follows the plate — the MODE
 * dial, the Konami code, the CTF prize — for as long as the pad is plugged in.
 *
 * The colour is each plate's `--hw-lightbar` token, a saturated LED colour chosen per
 * plate: the UI colours are tuned for a screen, and most of them read as a murky
 * glow through a lightbar's diffuser.
 *
 * Output reports follow the Linux hid-playstation driver's layouts. USB and Bluetooth
 * differ: Bluetooth wraps the same fields in a larger report sealed with a CRC32.
 */

// Just enough of WebHID for this file; the DOM lib does not ship its types.
interface HIDReportInfo {
	reportId: number;
}
interface HIDCollectionInfo {
	outputReports?: HIDReportInfo[];
}
interface HIDDevice extends EventTarget {
	opened: boolean;
	productId: number;
	collections: HIDCollectionInfo[];
	open(): Promise<void>;
	sendReport(reportId: number, data: Uint8Array): Promise<void>;
}
interface HIDConnectionEvent extends Event {
	device: HIDDevice;
}
interface HID extends EventTarget {
	getDevices(): Promise<HIDDevice[]>;
	requestDevice(options: { filters: { vendorId: number; productId: number }[] }): Promise<HIDDevice[]>;
}

const SONY = 0x054c;
type Model = 'ds4' | 'dualsense';
const MODELS: Record<number, Model> = {
	0x05c4: 'ds4', // DualShock 4, first revision
	0x09cc: 'ds4', // DualShock 4, second revision
	0x0ba0: 'ds4', // DualShock 4 USB wireless adaptor
	0x0ce6: 'dualsense',
	0x0df2: 'dualsense' // DualSense Edge
};

const DS4_USB = 0x05;
const DS4_BT = 0x11;
const DS_USB = 0x02;
const DS_BT = 0x31;
/** Bluetooth output reports are 78 bytes with the id; WebHID takes the id separately. */
const BT_LENGTH = 77;

type Pad = { device: HIDDevice; model: Model; bluetooth: boolean; seq: number; queue: Promise<void> };

const linked = writable(false);

/** True while at least one PlayStation pad has its lightbar under the plate's control. */
export const lightbarLinked: Readable<boolean> = readonly(linked);

const pads = new Map<HIDDevice, Pad>();
let rgb: [number, number, number] | null = null;

const hid = (): HID | null =>
	typeof navigator !== 'undefined' && 'hid' in navigator ? (navigator as unknown as { hid: HID }).hid : null;

/** WebHID exists here: Chromium desktop, secure context. */
export function lightbarSupported(): boolean {
	return hid() !== null;
}

/** A Sony pad is plugged in, going by the ids the Gamepad API reports. */
export function sonyPadPresent(): boolean {
	if (typeof navigator === 'undefined' || typeof navigator.getGamepads !== 'function') return false;
	try {
		return navigator
			.getGamepads()
			.some((p) => p?.connected && /054c|dualsense|dualshock|wireless controller/i.test(p.id));
	} catch {
		return false;
	}
}

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
	let c = n;
	for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
	return c >>> 0;
});

/**
 * Seal a Bluetooth report: CRC32 over a 0xA2 header byte (the HID "output" transaction
 * type), the report id and every byte before the checksum, written little-endian into
 * the last four bytes. The pad drops any report whose seal does not match.
 */
function seal(reportId: number, data: Uint8Array) {
	let crc = 0xffffffff;
	const feed = (byte: number) => (crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8));
	feed(0xa2);
	feed(reportId);
	for (let i = 0; i < data.length - 4; i++) feed(data[i]);
	crc = (crc ^ 0xffffffff) >>> 0;
	new DataView(data.buffer).setUint32(data.length - 4, crc, true);
}

/** DualShock 4: one report sets the colour. */
function ds4Report(pad: Pad, [r, g, b]: [number, number, number]): [number, Uint8Array] {
	const data = new Uint8Array(pad.bluetooth ? BT_LENGTH : 31);
	// Bluetooth prefixes two control bytes: "HID report + CRC present", then audio (none).
	const at = pad.bluetooth ? 2 : 0;
	if (pad.bluetooth) data[0] = 0xc0;
	data[at] = 0x02; // valid flags: lightbar only, so rumble and blink are left alone
	data.set([r, g, b], at + 5);
	if (!pad.bluetooth) return [DS4_USB, data];
	seal(DS4_BT, data);
	return [DS4_BT, data];
}

/**
 * DualSense: `setup` releases the lightbar from the firmware's own connect animation
 * (it fades the default blue out); a colour report without it is ignored until the
 * animation ends on its own.
 */
function dualsenseReport(pad: Pad, [r, g, b]: [number, number, number], setup: boolean): [number, Uint8Array] {
	const data = new Uint8Array(pad.bluetooth ? BT_LENGTH : 47);
	// Bluetooth prefixes a 4-bit sequence number and a fixed tag.
	const at = pad.bluetooth ? 2 : 0;
	if (pad.bluetooth) {
		data[0] = (pad.seq << 4) & 0xf0;
		data[1] = 0x10;
		pad.seq = (pad.seq + 1) & 0x0f;
	}
	if (setup) {
		data[at + 38] = 0x02; // valid flags 2: lightbar setup
		data[at + 41] = 0x02; // setup: light out
	} else {
		data[at + 1] = 0x04; // valid flags 1: lightbar colour
		data.set([r, g, b], at + 44);
	}
	if (!pad.bluetooth) return [DS_USB, data];
	seal(DS_BT, data);
	return [DS_BT, data];
}

/** Queue a write per pad: HID reports must not overlap on the same device. */
function send(pad: Pad, report: [number, Uint8Array]) {
	pad.queue = pad.queue
		.then(() => pad.device.sendReport(report[0], report[1]))
		.catch(() => {
			/* unplugged mid-write or refused: the next plate change tries again */
		});
}

function paint(pad: Pad) {
	if (!rgb) return;
	send(pad, pad.model === 'ds4' ? ds4Report(pad, rgb) : dualsenseReport(pad, rgb, false));
}

async function adopt(device: HIDDevice) {
	const model = MODELS[device.productId];
	if (!model || pads.has(device)) return;
	try {
		if (!device.opened) await device.open();
	} catch {
		return; // another tab or app holds it
	}
	const bt_id = model === 'ds4' ? DS4_BT : DS_BT;
	const bluetooth = device.collections.some((c) => c.outputReports?.some((r) => r.reportId === bt_id));
	const pad: Pad = { device, model, bluetooth, seq: 0, queue: Promise.resolve() };
	pads.set(device, pad);
	linked.set(true);
	if (model === 'dualsense') send(pad, dualsenseReport(pad, [0, 0, 0], true));
	paint(pad);
}

/**
 * First link, from a click: ask the browser for a PlayStation pad. Must be called
 * directly in the click handler — the prompt needs the user activation.
 */
export async function linkLightbar(): Promise<boolean> {
	const api = hid();
	if (!api) return false;
	try {
		const filters = Object.keys(MODELS).map((id) => ({ vendorId: SONY, productId: Number(id) }));
		const devices = await api.requestDevice({ filters });
		await Promise.all(devices.map(adopt));
	} catch {
		return false; // picker dismissed
	}
	return pads.size > 0;
}

/** Read the fitted plate's lightbar colour, as the browser resolved it. */
function readPlate(): [number, number, number] | null {
	const hex = getComputedStyle(document.documentElement).getPropertyValue('--hw-lightbar').trim();
	const m = /^#([0-9a-f]{6})$/i.exec(hex);
	if (!m) return null;
	const n = parseInt(m[1], 16);
	return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}

/** Start following the plate with any pad already granted. Call from onMount. */
export function startLightbar(): () => void {
	const api = hid();
	if (!api) return () => {};
	let raf = 0;

	function onConnect(event: Event) {
		void adopt((event as HIDConnectionEvent).device);
	}
	function onDisconnect(event: Event) {
		pads.delete((event as HIDConnectionEvent).device);
		linked.set(pads.size > 0);
	}

	api.addEventListener('connect', onConnect);
	api.addEventListener('disconnect', onDisconnect);
	void api.getDevices().then((devices) => devices.forEach((d) => void adopt(d)), () => {});

	// The layout writes `data-theme` in an effect; read the token a frame later, once
	// the new plate's variables have resolved.
	const unsubscribe = theme.subscribe(() => {
		cancelAnimationFrame(raf);
		raf = requestAnimationFrame(() => {
			rgb = readPlate();
			pads.forEach(paint);
		});
	});

	return () => {
		unsubscribe();
		cancelAnimationFrame(raf);
		api.removeEventListener('connect', onConnect);
		api.removeEventListener('disconnect', onDisconnect);
		pads.clear();
		linked.set(false);
	};
}
