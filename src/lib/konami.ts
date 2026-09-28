import { get } from 'svelte/store';
import { theme } from '$lib/stores/theme';

/**
 * ↑ ↑ ↓ ↓ ← → ← → B A — the Konami code borrows the sealed MR ROBOT plate.
 *
 * Borrows, not wins: the plate is fitted with `theme.visit`, so nothing is persisted
 * and the MODE dial never lists it (that still takes the console CTF). Entering the
 * code again hands back the plate it replaced; a reload does the same.
 *
 * Keyboard and pad feed the same sequence through `konami()`, in the pad's own tokens,
 * so a mixed entry (arrows on the keyboard, B A on the controller) also counts.
 */
const CODE = ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'b', 'a'] as const;
export type KonamiToken = (typeof CODE)[number];

const PLATE = 'mrrobot';

const KEYS: Record<string, KonamiToken> = {
	ArrowUp: 'up',
	ArrowDown: 'down',
	ArrowLeft: 'left',
	ArrowRight: 'right',
	b: 'b',
	B: 'b',
	a: 'a',
	A: 'a'
};

let at = 0;
/** The plate the code replaced, while the borrowed one is on. */
let lent_over: string | null = null;

/**
 * Feed one input. Any wrong token restarts the entry — or starts it, if it is `up`.
 * Returns true on the press that completes the code, so the caller can swallow it.
 */
export function konami(token: KonamiToken): boolean {
	if (token === CODE[at]) at++;
	// ↑ ↑ ↑: the extra up is still a valid first two, so keep the entry alive.
	else at = token === 'up' ? (at === 2 ? 2 : 1) : 0;
	if (at < CODE.length) return false;
	at = 0;

	const current = get(theme);
	if (current === PLATE && lent_over) {
		theme.visit(lent_over);
		lent_over = null;
	} else if (current !== PLATE) {
		lent_over = current;
		theme.visit(PLATE);
		console.log('%chello, friend.', 'font-weight: bold;');
	}
	return true;
}

/** Keyboard half. Call from onMount; returns the cleanup. */
export function startKonami(): () => void {
	function onKey(e: KeyboardEvent) {
		// Synthetic keydowns are the pad talking through the keyboard; it reports its
		// own presses to `konami()`, so counting these too would double every step.
		if (!e.isTrusted || e.metaKey || e.ctrlKey || e.altKey) return;
		const target = e.target as HTMLElement | null;
		if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;
		const token = KEYS[e.key];
		if (token) konami(token);
		else at = 0;
	}
	window.addEventListener('keydown', onKey);
	return () => window.removeEventListener('keydown', onKey);
}
