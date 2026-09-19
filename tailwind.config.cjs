const tailwind_theme = require('tailwindcss/defaultTheme');

/*
	Tailwind mirror of the faceplate tokens in `src/app.css`. Every key here is a
	CSS custom property, so a faceplate swap repaints the whole site without a
	single component-level override.

	`darkMode: 'class'` is kept only so `dark:` variants still compile; nothing in
	the app uses them — themes are token swaps, not class forks.
*/
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'class',

	theme: {
		extend: {
			fontFamily: {
				sans: ['var(--font-body)', ...tailwind_theme.fontFamily.sans],
				mono: ['var(--font-mono)', ...tailwind_theme.fontFamily.mono],
				pixel: ['var(--font-pixel)', ...tailwind_theme.fontFamily.mono]
			},
			fontSize: {
				xxs: '10px',
				tiny: '9px',
				micro: '8px',
				nano: '7px',
				pico: '6px',
				femto: '5px'
			},
			borderRadius: {
				DEFAULT: 'var(--radius)'
			},
			borderWidth: {
				DEFAULT: 'var(--stroke)'
			},
			colors: {
				page: 'var(--bg)',
				panel: 'var(--panel)',
				sunk: 'var(--panel-sunk)',
				hover: 'var(--hover)',
				ink: 'var(--ink)',
				dim: 'var(--ink-dim)',
				line: 'var(--line)',
				accent: 'var(--accent)',
				'accent-ink': 'var(--accent-ink)',
				'accent-wash': 'var(--accent-wash)',
				scrim: 'var(--scrim)',
				'screen-dark': 'var(--screen-dark)',
				ok: 'var(--ok)',
				rec: 'var(--rec)',
				warn: 'var(--warn)'
			}
		}
	},

	plugins: [require('@tailwindcss/typography')]
};

module.exports = config;
