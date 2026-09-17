import { writable } from 'svelte/store';
import { browser } from '$app/environment';

/**
 * Available palettes. The `light` id maps to the `:root` values in app.css, every
 * other id to a `:root[data-theme='<id>']` block. `dark` also toggles the `.dark`
 * class, which drives Tailwind's `dark:` variants.
 */
export const THEMES = [
	{ id: 'light', label: 'LIGHT', dark: false },
	{ id: 'dark', label: 'DARK', dark: true }
];

const stored = browser ? localStorage.getItem('theme') : null;
const prefers_dark = browser && window.matchMedia('(prefers-color-scheme: dark)').matches;
const initial = THEMES.find((t) => t.id === stored)?.id ?? (prefers_dark ? 'dark' : 'light');

export const theme = writable(initial);

if (browser) {
	theme.subscribe((id) => localStorage.setItem('theme', id));
}
