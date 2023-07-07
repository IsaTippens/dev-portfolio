<script>
	import SocialBlock from '$lib/components/social/SocialBlock.svelte';
	import EmailBlock from '$lib/components/social/EmailBlock.svelte';
	import InstagramBlock from '$lib/components/social/InstagramBlock.svelte';
	import TwitterBlock from '$lib/components/social/TwitterBlock.svelte';
	import GithubBlock from '$lib/components/social/GithubBlock.svelte';
	import YoutubeBlock from '$lib/components/social/YoutubeBlock.svelte';
</script>

<svelte:head>
	<title>Social</title>
	<meta name="description" content="Social Links" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="canonical" href="https://isatippens.com/social" />
</svelte:head>
<div>
	<span class="font-semibold highlight-text">
		<a href="/" class="highlight-text">Home</a> / <span class="crumb-end">Social</span>
	</span>
</div>
<div class="sticky top-0 z-10 blog-header">
	<p class="text-3xl semibold highlight-text">Social Links</p>
</div>
<br/>
<main>
	<div class="flex flex-col space-y-4">
		<EmailBlock email="isatippens2@gmail.com" />
		<InstagramBlock user={'issssaaaaaaaaaaaaaahhhhhhhhhhh'} />
		<TwitterBlock user={'issssaaaaaaaaah'} />
		<GithubBlock user={'IsaTippens'} />
		<YoutubeBlock channel={'issaaahhhh'} />
	</div>	
</main>
