import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async (event) => {
	const parent = await event.parent();

	const slate = parent.contest.slates[parent.slateIndex];
	if (!slate) {
		throw error(404, 'Unable to find slate given index ' + parent.slateIndex);
	}

	const match = slate.matches.find((match) => match.id === event.params.matchId);
	if (!match) {
		throw error(404, 'Unable to find match given id ' + event.params.matchId);
	}

	const gameIdx = parseInt(event.params.gameIndex);
	const game = match.games[gameIdx];
	if (!game) {
		throw error(404, 'Unable to find game given index ' + event.params.gameIndex);
	}

	const scores = game.score.map((value, idx) => {
		return {
			value,
			playerId: match.players[idx]
		};
	});

	return {
		matchId: match.id,
		gameIdx,
		scores
	};
};
