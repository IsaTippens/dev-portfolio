const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
            fontFamily: {
				lato: ['Lato'],
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
