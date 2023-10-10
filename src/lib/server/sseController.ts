import { gameScoreUpdatesEmitter } from '$lib/server/database/contests';

type Listener = {
	fn: ((e: ScoreChangeEvent) => void) | null;
	intervalHandle: NodeJS.Timeout;
};

const listenersBySession: Record<string, Listener> = {};
type SlateIdentifier = {
	contestId: string;
	slateIndex: number;
};

type ScoreChangeEvent = SlateIdentifier & {
	matchId: string;
	gameIdx: number;
	scores: number[];
};

export function registerListener(
	{ contestId, slateIndex }: { contestId: string; slateIndex: number | null },
	sessionId: string
) {
	const existingListener = listenersBySession[sessionId];
	if (existingListener && existingListener.fn) {
		if (existingListener.fn) {
			gameScoreUpdatesEmitter.removeListener('score-change', existingListener.fn);
		}

		if (existingListener.intervalHandle) {
			clearInterval(existingListener.intervalHandle);
		}
	}

	listenersBySession[sessionId] = existingListener || {};

	const stream = new ReadableStream({
		start(controller) {
			const listener = (scoreChangeEvent: ScoreChangeEvent) => {
				if (contestId !== scoreChangeEvent.contestId) return;
				if (slateIndex !== null && slateIndex !== scoreChangeEvent.slateIndex) return;

				controller.enqueue(
					`event: score-change\ndata: ${JSON.stringify({
						matchId: scoreChangeEvent.matchId,
						gameIndex: scoreChangeEvent.gameIdx,
						scores: scoreChangeEvent.scores,
						slateIndex: scoreChangeEvent.slateIndex
					})}\n\n`
				);
			};
			gameScoreUpdatesEmitter.on('score-change', listener);

			const interval = setInterval(() => {
				controller.enqueue(`event: ping\ndata: ${Date.now()}\n\n`);
			}, 5000);
			listenersBySession[sessionId] = {
				...listenersBySession[sessionId],
				fn: listener,
				intervalHandle: interval
			};
		},

		cancel() {
			clearInterval(listenersBySession[sessionId].intervalHandle);

			const listenerToRemove = listenersBySession[sessionId]?.fn;
			if (listenerToRemove) {
				gameScoreUpdatesEmitter.removeListener('score-change', listenerToRemove);
			}
		}
	});

	return stream;
}
