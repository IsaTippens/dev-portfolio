import { readonly, writable, type Readable } from 'svelte/store';

/**
 * The device's ports as the always-loaded layout sees them: is a pad plugged in, is a
 * lightbar linked, can this browser link one. The drivers behind them — `$lib/gamepad`
 * and `$lib/lightbar` — load on demand and report through the setters.
 */

const connected = writable(false);
/** True while a standard-mapping pad is plugged in, whatever the plate. */
export const padConnected: Readable<boolean> = readonly(connected);
export const setPadConnected = (value: boolean) => connected.set(value);

const linked = writable(false);
/** True while at least one PlayStation pad has its lightbar under the plate's control. */
export const lightbarLinked: Readable<boolean> = readonly(linked);
export const setLightbarLinked = (value: boolean) => linked.set(value);

// Just enough of WebHID for the lightbar driver; the DOM lib does not ship its types.
interface HIDReportInfo {
	reportId: number;
}
interface HIDCollectionInfo {
	outputReports?: HIDReportInfo[];
}
export interface HIDDevice extends EventTarget {
	opened: boolean;
	productId: number;
	collections: HIDCollectionInfo[];
	open(): Promise<void>;
	sendReport(reportId: number, data: Uint8Array): Promise<void>;
}
export interface HIDConnectionEvent extends Event {
	device: HIDDevice;
}
export interface HID extends EventTarget {
	getDevices(): Promise<HIDDevice[]>;
	requestDevice(options: { filters: { vendorId: number; productId: number }[] }): Promise<HIDDevice[]>;
}

/** The browser's WebHID entry point, or null where there is none. */
export function hid(): HID | null {
	if (typeof navigator === 'undefined' || !('hid' in navigator)) return null;
	// lib.dom ships no WebHID types; `HID` above is the slice the lightbar driver uses.
	const api = navigator.hid as HID;
	return api;
}

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
