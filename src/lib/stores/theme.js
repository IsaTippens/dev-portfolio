import { writable } from 'svelte/store';
import { browser } from '$app/environment';

/**
 * Face plate registry — the plates the device ships with.
 *
 * `id` must match a `:root[data-theme='<id>']` block in `app.css`; `color` is that
 * plate's `--bg`, used for the <meta name="theme-color"> that paints the browser
 * chrome before first paint. `label` is what the MODE dial shows.
 *
 * Adding a plate is two edits: a token block in `app.css`, and a row here. If a
 * plate needs anything more than that, the components are not token-pure yet.
 */
export const THEMES = [
	{
		id: 'light',
		label: 'LIGHT',
		color: '#f4f4f5',
		note: 'paper + ink'
	},
	{
		id: 'dark',
		label: 'DARK',
		color: '#1a1b1e',
		note: 'charcoal + off-white'
	},
	{
		id: 'phosphor',
		label: 'PHOSPHOR',
		color: '#04070a',
		note: 'green phosphor scope'
	},
	{
		id: 'gameboy',
		label: 'GAMEBOY',
		color: '#306230',
		note: 'four-tone DMG'
	},
	{
		id: 'ps1',
		label: 'PS1',
		color: '#c8c2b4',
		note: 'console grey + symbols'
	},
	{
		id: 'ps2',
		label: 'PS2',
		color: '#0d0f14',
		note: 'charcoal black + wordmark blue'
	}
];

export const THEME_IDS = THEMES.map((t) => t.id);

/**
 * Plates the OS preference maps to until the operator picks one: a light OS gets
 * the PS1 plate, a dark OS gets PS2. Exported so the pre-paint boot script in
 * `hooks.server.js` reads the same mapping.
 */
export const OS_PLATES = { light: 'ps1', dark: 'ps2' };

/**
 * Where a manual MODE dial pick is stored. Deliberately not the legacy `theme` key:
 * the old store wrote that one on every visit with the auto-detected value, so any
 * browser that visited before this store existed carries a stored plate that was
 * never an operator pick — and honouring those would freeze the plate forever.
 */
export const PLATE_KEY = 'plate';

if (browser) {
	// Drop the legacy key: every value it holds was written by the store, not a pick.
	try {
		localStorage.removeItem('theme');
	} catch {
		/* private mode: nothing was stored anyway */
	}
}

const stored = browser ? localStorage.getItem(PLATE_KEY) : null;
const manual_pick = typeof stored === 'string' && THEME_IDS.includes(stored) ? stored : null;

/** The OS plate right now: ps1 under a light scheme, dark under a dark one. */
const os_plate = () =>
	browser &&
	typeof window.matchMedia === 'function' &&
	window.matchMedia('(prefers-color-scheme: dark)').matches
		? OS_PLATES.dark
		: OS_PLATES.light;

let manual = manual_pick !== null;

const { subscribe, set } = writable(manual_pick ?? os_plate());

/**
 * Current face plate id. Follows the OS scheme — at boot and live, on
 * `prefers-color-scheme` change — until the operator turns the MODE dial. A dial
 * pick is persisted and ends OS following (clearing localStorage returns the
 * device to automatic).
 */
export const theme = {
	subscribe,
	/** Operator pick: persist it and stop following the OS. */
	/** @param {string} id */
	set(id) {
		manual = true;
		try {
			localStorage.setItem(PLATE_KEY, id);
		} catch {
			/* private mode: the plate just won't persist */
		}
		set(id);
	}
};

if (browser && typeof window.matchMedia === 'function') {
	const scheme = window.matchMedia('(prefers-color-scheme: dark)');
	scheme.addEventListener('change', () => {
		if (!manual) set(os_plate());
	});
}
