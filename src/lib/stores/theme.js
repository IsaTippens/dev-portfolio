import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const initialValue = browser
	? localStorage.getItem('theme') === 'dark' ||
		(!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
	: false;
export const is_dark = writable(initialValue);

if (browser) {
	is_dark.subscribe((value) => {
		localStorage.setItem('theme', value ? 'dark' : 'light');
	});
}
