<script lang="ts">
	import { THEMES, theme } from '$lib/stores/theme';
	import Panel from '$lib/components/Panel.svelte';

	/**
	 * MODE — the faceplate dial.
	 *
	 * A rotary switch, not a dropdown. Four detents, one per plate; the pointer sits on
	 * the current plate's position. Keyboard: arrows walk the detents, Enter commits,
	 * ESC backs out. It is a `listbox` to assistive tech and a knob to everyone else.
	 */
	let open = $state(false);
	let active = $state(0);
	let trigger: HTMLButtonElement | null = $state(null);
	let options = $state<HTMLButtonElement[]>([]);

	const index_of = (id: string) => Math.max(0, THEMES.findIndex((t) => t.id === id));
	const detent = (i: number) => -45 + (i * 90) / Math.max(1, THEMES.length - 1);

	function openList(start_at_current = true) {
		active = start_at_current ? index_of($theme) : active;
		open = true;
	}

	function close({ focus_trigger = true } = {}) {
		open = false;
		if (focus_trigger) trigger?.focus();
	}

	function commit(id: string) {
		theme.set(id);
		close();
	}

	function move(delta: number) {
		const n = THEMES.length;
		active = (active + delta + n) % n;
	}

	function onTriggerKeydown(event: KeyboardEvent) {
		if (open) return;
		if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
			event.preventDefault();
			openList();
		}
	}

	function onListKeydown(event: KeyboardEvent) {
		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				move(1);
				break;
			case 'ArrowUp':
				event.preventDefault();
				move(-1);
				break;
			case 'Home':
				event.preventDefault();
				active = 0;
				break;
			case 'End':
				event.preventDefault();
				active = THEMES.length - 1;
				break;
			case 'Enter':
			case ' ':
				event.preventDefault();
				commit(THEMES[active].id);
				break;
			case 'Escape':
				event.preventDefault();
				close();
				break;
			case 'Tab':
				close({ focus_trigger: false });
				break;
		}
	}

	// Focus follows the highlighted detent while the list is open, so the visual and
	// the accessible state never disagree.
	$effect(() => {
		if (open) options[active]?.focus();
	});

	function onWindowPointerDown(event: PointerEvent) {
		if (!open) return;
		const target = event.target as Node | null;
		if (target && !target.isConnected) return;
		if (trigger?.contains(event.target as Node)) return;
		const list = document.getElementById('mode-list');
		if (list?.contains(event.target as Node)) return;
		close({ focus_trigger: false });
	}
</script>

<svelte:window onpointerdown={onWindowPointerDown} />

<div class="relative">
	<button
		bind:this={trigger}
		type="button"
		class="flex items-center gap-1.5 border border-line bg-sunk px-1.5 py-0.5 font-bold text-tiny uppercase tracking-wider"
		aria-haspopup="listbox"
		aria-expanded={open}
		aria-controls="mode-list"
		onclick={() => (open ? close() : openList())}
		onkeydown={onTriggerKeydown}
		title="Face plate — arrow keys, Enter to commit"
	>
		MODE:
		<span class="inline-flex items-center gap-1 text-accent">
			<span
				class="relative inline-block h-3.5 w-3.5 rounded-full border border-line"
				style="background: radial-gradient(circle at 30% 25%, var(--panel-sunk), var(--panel))"
			>
				<span
					class="absolute left-1/2 top-0.5 h-1 w-[1px] -translate-x-1/2 bg-ink"
					style="transform-origin: 50% 150%; transform: rotate({detent(index_of($theme))}deg)"
				></span>
			</span>
			{$theme.toUpperCase()}
		</span>
	</button>

	{#if open}
		<Panel
			tag="PLATE_SEL"
			screws={true}
			class="absolute right-0 top-[calc(100%+6px)] z-40 w-60 p-2"
			role="listbox"
			id="mode-list"
			aria-label="Face plate"
			tabindex="-1"
			onkeydown={onListKeydown}
		>
			<div class="flex flex-col gap-1">
				{#each THEMES as plate, i (plate.id)}
					<button
						bind:this={options[i]}
						type="button"
						role="option"
						aria-selected={plate.id === $theme}
						tabindex="-1"
						class="flex items-center justify-between gap-2 border border-transparent px-2 py-1.5 text-left text-tiny uppercase tracking-wider {i ===
						active
							? 'border-line bg-hover text-ink'
							: 'text-dim'}"
						onclick={() => commit(plate.id)}
						onmousemove={() => (active = i)}
					>
						<span class="flex items-center gap-2">
							<span
								class="led"
								data-on={plate.id === $theme ? 'ok' : 'false'}
								aria-hidden="true"
							></span>
							{plate.label}
						</span>
						<span class="text-micro normal-case tracking-normal opacity-70">{plate.note}</span>
					</button>
				{/each}
			</div>
		</Panel>
	{/if}
</div>
