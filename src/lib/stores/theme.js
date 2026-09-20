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
	}
];

export const THEME_IDS = THEMES.map((t) => t.id);

const OS_LIGHT = 'light';
const OS_DARK = 'dark';

/** Plates that should track a dark OS preference. */
const OS_PREFERENCE = { [OS_LIGHT]: 'light', [OS_DARK]: 'dark' };

const stored = browser ? localStorage.getItem('theme') : null;
const prefers_dark =
	browser && typeof window.matchMedia === 'function'
		? window.matchMedia('(prefers-color-scheme: dark)').matches
		: false;

const initial =
	(typeof stored === 'string' && THEME_IDS.includes(stored) ? stored : null) ?? OS_PREFERENCE[prefers_dark ? OS_DARK : OS_LIGHT];

/** Current face plate id. Persisted; defaults to the OS preference on first visit. */
export const theme = writable(initial);

if (browser) {
	theme.subscribe((id) => {
		try {
			localStorage.setItem('theme', id);
		} catch {
			/* private mode: the plate just won't persist */
		}
	});
}
