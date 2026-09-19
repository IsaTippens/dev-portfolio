/**
 * List traversal for the post and project rows: `j` / `k` move focus down and up the
 * list, `Enter` opening the focused row is the anchor's own behaviour. Stops at the
 * ends rather than wrapping, so the list has a definite bottom the way a machine does.
 *
 * Attach to the list container; rows are marked `data-row`.
 *
 * @param {HTMLElement} node
 */
export function rowNav(node) {
	/** @returns {HTMLElement[]} */
	const rows = () =>
		/** @type {HTMLElement[]} */ ([...node.querySelectorAll('[data-row]:not([hidden])')]);

	/** @param {KeyboardEvent} event */
	function on_keydown(event) {
		if (event.metaKey || event.ctrlKey || event.altKey) return;
		if (event.key !== 'j' && event.key !== 'k') return;

		const target = event.target;
		const typing =
			target instanceof HTMLElement &&
			(target.isContentEditable || /^(INPUT|SELECT|TEXTAREA)$/.test(target.tagName));
		if (typing) return;

		const list = rows();
		if (!list.length) return;

		const current = list.findIndex((row) => row === document.activeElement || row.contains(document.activeElement));
		const next =
			event.key === 'j'
				? current < 0
					? 0
					: Math.min(list.length - 1, current + 1)
				: current < 0
					? list.length - 1
					: Math.max(0, current - 1);

		event.preventDefault();
		list[next].focus();
		list[next].scrollIntoView({ block: 'nearest' });
	}

	window.addEventListener('keydown', on_keydown);
	return {
		destroy() {
			window.removeEventListener('keydown', on_keydown);
		}
	};
}
