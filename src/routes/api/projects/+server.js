import { load_entries } from '#lib/server/content.js';

export function GET() {
	return Response.json(load_entries('projects'));
}
