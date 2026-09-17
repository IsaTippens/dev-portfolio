<script lang="ts">
	import { page } from '$app/state';

	let status = $derived(page.status);
	let message = $derived(page.error?.message ?? 'UNKNOWN_FAULT');
</script>

<div class="flex flex-col items-center gap-3 py-12 text-center font-mono">
	<div class="text-tiny uppercase tracking-widest text-accent">[SIGNAL_LOST]</div>
	<div class="text-6xl font-bold tracking-tight text-main">{status}</div>
	<div class="max-w-sm text-xxs uppercase leading-loose tracking-widest text-muted">
		{message}
	</div>
	<a href="/" class="btn-primary mt-3">RETURN_HOME</a>
</div>
