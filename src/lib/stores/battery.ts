import { writable } from 'svelte/store';

export const isCharging = writable(false);
export const batteryLevel = writable(100);
export const playLightning = writable(false);
