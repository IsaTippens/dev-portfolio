<script>
	import { is_dark } from '$lib/stores/theme';
	import { setContext } from 'svelte';

	setContext('theme', { is_dark });
</script>

<slot />
