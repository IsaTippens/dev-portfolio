import { json } from '@sveltejs/kit';
import { load_entries } from '$lib/server/content';

// Stays on the Worker: CTF flag 2 is the `x-flag` response header, which a
// prerendered static file would not carry.
export const prerender = false;

export function GET() {
	// CTF flag 2 of 4, reached from flag 1 (`curl -i`). ROT13: the ISA{ prefix is the
	// crib. The chain is written up in src/lib/ctf/SOLUTIONS.md.
	return json(load_entries('blog'), {
		headers: { 'x-flag': 'VFN{e0o0gf_xa0j_ju3e3_gu3_z0a3l_vf}' }
	});
}
