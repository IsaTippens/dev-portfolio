const tailwind_theme = require('tailwindcss/defaultTheme')

const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
            fontFamily: {
				sans: ['Open Sans', ...tailwind_theme.fontFamily.sans],
				mono: ['JetBrains Mono', ...tailwind_theme.fontFamily.mono],
            },
			colors: {
				'dark': '#000000',
				'dark-text': '#e0e0e0',
				'dark-divider': '#424242',
				'light': '#fafafa',
				'light-text': '#121212',
				'light-divider': '#e0e0e0',
			},
        }
	},

	plugins: [require('@tailwindcss/typography'),]
};

module.exports = config;
