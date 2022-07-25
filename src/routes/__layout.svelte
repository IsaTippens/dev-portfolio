<script>
	import '../app.css';
	import '../prism.css';
	import "@fontsource/noto-sans/400.css"
</script>

<div class="flex h-screen">
	<div class="flex-grow max-w-xl m-auto p-4">
		<slot />
	</div>
</div>

<style>
	@font-face {
		font-family: 'Noto Sans';
		font-style: normal;
		font-weight: 400;
		src: local('Noto Sans Regular'), local('NotoSans-Regular'), url(https://fonts.gstatic.com/s/notosans/v8/0Y_EVFIl57t8D0gp32YfdA.woff2) format('woff2');
		unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
	}
</style>
