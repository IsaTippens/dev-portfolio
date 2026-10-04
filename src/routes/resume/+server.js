import { read } from '$app/server';
import cv from '../../../content/resume/Isa Tippens CV.pdf';

/** The CV ships with the build: no GitHub round trip, streamed rather than buffered. */
export function GET() {
	const file = read(cv);
	file.headers.set('Content-Disposition', 'attachment; filename="Isa Tippens CV.pdf"');
	return file;
}
