import { registerListener } from '$lib/server/sseController';
import type { RequestEvent } from './$types';

export async function GET(event: RequestEvent) {
	const sessionId = event.cookies.get('sessionId');
	if (!sessionId) {
		return new Response(null);
	}
	const params = event.url.searchParams;
	const contestId = params.get('contestId');
	const slateIndexParam = params.get('slateIndex');

	if (!contestId) {
		return;
	}
	const slateIndex = slateIndexParam && parseInt(slateIndexParam);
	const stream = registerListener({ contestId, slateIndex: slateIndex || null }, sessionId);

	return new Response(stream, {
		headers: {
			'Cache-Control': 'no-store',
			'Content-Type': 'text/event-stream',
			Connection: 'keep-alive',
			'X-Accel-Buffering': 'no' // Prevent nginx from buffering the events
		}
	});
}
