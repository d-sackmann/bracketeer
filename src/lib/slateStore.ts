import { writable, type Subscriber, type Readable } from 'svelte/store';
import type { Slate } from './core';
import type { ScoreChangeEventSource } from './eventSource';

type GameIdentifier = { matchId: string; gameIndex: number };

export type SlateStore = Readable<Slate> & {
	updateScore: (gameIdentifier: GameIdentifier, score: number[]) => void;
	linkToEventSource: (EventSource: ScoreChangeEventSource) => () => void;
};
export default function (initialValue: Slate): SlateStore {
	const store = writable(initialValue);
	return {
		subscribe(cb: Subscriber<Slate>) {
			return store.subscribe(cb);
		},

		updateScore(gameIdentifier: GameIdentifier, score: number[]) {
			store.update((oldSlateValue) => {
				const matchIdx = oldSlateValue.matches.findIndex(({ id }) => id === gameIdentifier.matchId);
				const match = oldSlateValue.matches[matchIdx];
				const game = match?.games[gameIdentifier.gameIndex];
				if (!game) {
					return oldSlateValue;
				}

				const updatedMatch = {
					...match,
					games: match.games
						.slice(0, gameIdentifier.gameIndex)
						.concat([{ score }])
						.concat(match.games.slice(gameIdentifier.gameIndex + 1))
				};

				const newValue = {
					...oldSlateValue,
					matches: oldSlateValue.matches
						.slice(0, matchIdx)
						.concat([updatedMatch])
						.concat(oldSlateValue.matches.slice(matchIdx + 1))
				};

				return newValue;
			});
		},

		linkToEventSource(source: ScoreChangeEventSource) {
			const unsubscribe = source.subscribe((data) => {
				let scoreChange;

				try {
					scoreChange = JSON.parse(data) as {
						matchId: string;
						gameIndex: number;
						scores: number[];
					};
				} catch (_e) {
					return;
				}

				this.updateScore(scoreChange, scoreChange.scores);
			});

			return () => {
				unsubscribe();
				source.close();
			};
		}
	};
}
