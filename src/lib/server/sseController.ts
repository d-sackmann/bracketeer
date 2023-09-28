import { gameScoreUpdatesEmitter } from '$lib/server/database/contests';

type Listener = {
	sessionId: string;
	contestId: string;
	slateIndex: number;
	fn: ((e: ScoreChangeEvent) => void) | null;
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

export function registerListener({ contestId, slateIndex }: SlateIdentifier, sessionId: string) {
	const existingListener = listenersBySession[sessionId];
	if (existingListener && existingListener.fn) {
		gameScoreUpdatesEmitter.removeListener('score-change', existingListener.fn);
	}

	listenersBySession[sessionId] = existingListener || {};

	const stream = new ReadableStream({
		start(controller) {
			const listener = (scoreChangeEvent: ScoreChangeEvent) => {
				if (
					contestId !== scoreChangeEvent.contestId ||
					slateIndex !== scoreChangeEvent.slateIndex
				) {
					return;
				}
				controller.enqueue(
					`event: score-change\ndata: ${JSON.stringify({
						matchId: scoreChangeEvent.matchId,
						gameIndex: scoreChangeEvent.gameIdx,
						scores: scoreChangeEvent.scores
					})}\n\n`
				);
			};
			gameScoreUpdatesEmitter.on('score-change', listener);

			listenersBySession[sessionId] = {
				...listenersBySession[sessionId],
				fn: listener
			};
		},

		cancel() {
			const listenerToRemove = listenersBySession[sessionId]?.fn;
			if (listenerToRemove) {
				gameScoreUpdatesEmitter.removeListener('score-change', listenerToRemove);
			}
		}
	});

	listenersBySession[sessionId] = {
		...listenersBySession[sessionId],
		contestId,
		slateIndex,
		sessionId
	};
	return stream;
}