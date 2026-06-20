const tailwind_theme = require('tailwindcss/defaultTheme');

const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'class',

	theme: {
		extend: {
			fontFamily: {
				sans: ['JetBrains Mono', 'monospace', ...tailwind_theme.fontFamily.mono],
				mono: ['JetBrains Mono', 'monospace', ...tailwind_theme.fontFamily.mono]
			},
			fontSize: {
				xxs: '10px',
				tiny: '9px',
				micro: '8px',
				nano: '7px',
				pico: '6px',
				femto: '5px'
			},
			colors: {
				accent: 'var(--accent-color)',
				background: 'var(--bg-body)',
				card: 'var(--bg-card)',
				main: 'var(--text-main)',
				muted: 'var(--text-muted)',
				border: 'var(--border-main)'
			}
		}
	},

	plugins: [require('@tailwindcss/typography')]
};

module.exports = config;
