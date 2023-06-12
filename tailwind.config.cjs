const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
            fontFamily: {
                univers: ['Noto-Sans'],
				lato: ['Lato'],
            },
			colors: {
				'dark': '#121212',
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
