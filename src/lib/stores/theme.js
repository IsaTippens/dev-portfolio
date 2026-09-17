import { writable } from 'svelte/store';
import { browser } from '$app/environment';

/**
 * Available palettes. The `light` id maps to the `:root` values in app.css, every
 * other id to a `:root[data-theme='<id>']` block. `dark` also toggles the `.dark`
 * class, which drives Tailwind's `dark:` variants. `color` is the palette's body
 * background, used for the <meta name="theme-color"> that bootstraps before paint.
 */
export const THEMES = [
	{ id: 'light', label: 'LIGHT', dark: false, color: '#f4f4f5' },
	{ id: 'dark', label: 'DARK', dark: true, color: '#09090b' }
];

const fallback_light = THEMES.find((t) => !t.dark)?.id ?? THEMES[0].id;
const fallback_dark = THEMES.find((t) => t.dark)?.id;

const stored = browser ? localStorage.getItem('theme') : null;
const prefers_dark = browser && window.matchMedia('(prefers-color-scheme: dark)').matches;
const initial =
	THEMES.find((t) => t.id === stored)?.id ??
	(prefers_dark && fallback_dark ? fallback_dark : fallback_light);

export const theme = writable(initial);

if (browser) {
	theme.subscribe((id) => localStorage.setItem('theme', id));
}
