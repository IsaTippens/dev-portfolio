const tailwind_theme = require('tailwindcss/defaultTheme');

/*
	Tailwind mirror of the faceplate tokens in `src/app.css`. Every key here is a
	CSS custom property, so a faceplate swap repaints the whole site without a
	single component-level override.
*/
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontFamily: {
				sans: ['var(--font-body)', ...tailwind_theme.fontFamily.sans],
				mono: ['var(--font-mono)', ...tailwind_theme.fontFamily.mono]
			},
			fontSize: {
				xxs: '11px',
				tiny: '11px',
				micro: '10px',
				nano: '10px',
				pico: '9px',
				femto: '9px'
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
	}
};

module.exports = config;
