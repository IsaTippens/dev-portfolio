import { get, writable } from 'svelte/store';

export const isCharging = writable(false);
/**
 * Percentage, or `null` until the machine reports one. It is deliberately not
 * seeded with a guess: a device that shows 100% when it has 42% is lying, and the
 * readout is supposed to be an instrument.
 */
export const batteryLevel = writable<number | null>(null);
export const playLightning = writable(false);

/**
 * Length of one charge-banner run. Long enough for the ticker to cross the whole
 * status bar at a readable speed; the banner's CSS timeline is expressed in
 * percentages of this, so the two cannot drift apart.
 */
export const CHARGE_BANNER_MS = 3400;

let banner_timer: number | undefined;

/** Plays the charge banner. A re-plug mid-run restarts it rather than cutting it short. */
export function announceCharge() {
	window.clearTimeout(banner_timer);
	playLightning.set(false);
	requestAnimationFrame(() => {
		playLightning.set(true);
		banner_timer = window.setTimeout(() => playLightning.set(false), CHARGE_BANNER_MS);
	});
}

/** Plugs the charger in or pulls it out. Only plugging in is announced. */
export function setCharging(next: boolean) {
	if (next && !get(isCharging)) announceCharge();
	isCharging.set(next);
}

export function toggleCharging() {
	setCharging(!get(isCharging));
}
