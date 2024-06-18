import { writable } from 'svelte/store';
import { browser } from '$app/environment';


const initialValue = browser && window.matchMedia('(prefers-color-scheme: dark)').matches;
export const is_dark = writable(initialValue);


if (browser) {
  const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const updateTheme = () => is_dark.set(colorSchemeQuery.matches);
  colorSchemeQuery.addEventListener('change', updateTheme);
  updateTheme();
}