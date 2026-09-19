import { writable } from 'svelte/store';

export const isCharging = writable(false);
/**
 * Percentage, or `null` until the machine reports one. It is deliberately not
 * seeded with a guess: a device that shows 100% when it has 42% is lying, and the
 * readout is supposed to be an instrument.
 */
export const batteryLevel = writable<number | null>(null);
export const playLightning = writable(false);
