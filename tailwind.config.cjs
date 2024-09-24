const tailwind_theme = require('tailwindcss/defaultTheme')

const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontFamily: {
				sans: ["Atkinson Hyperlegible", ...tailwind_theme.fontFamily.sans],
			},
			colors: {
				'dark': '#111111',
				'dark-text': '#e0e0e0',
				'dark-divider': '#424242',
				'light': '#fafafa',
				'light-text': '#121212',
				'light-divider': '#e0e0e0',
			},
        }
	},

	plugins: [require('@tailwindcss/typography'),require('daisyui'),]
};

module.exports = config;
