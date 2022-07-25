const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
            fontFamily: {
                univers: ['Noto-Sans'],
            },
        }
	},

	plugins: [require('@tailwindcss/typography'),]
};

module.exports = config;
