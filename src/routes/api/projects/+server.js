import { json } from '@sveltejs/kit';
import { load_entries } from '$lib/server/content';

export function GET() {
	return json(load_entries('projects'));
}
