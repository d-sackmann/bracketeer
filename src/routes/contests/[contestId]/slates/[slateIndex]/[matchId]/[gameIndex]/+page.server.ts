import { updateGameScores } from '$lib/server/database/contests';
import type { Actions } from './$types';

export const actions = {
	default: async ({ request, params }) => {
		const formData = await request.formData();

		const scoresFromForm = formData.getAll('scores');
		const playersFromForm = formData.getAll('players');

		const scores = playersFromForm.map((playerId, idx) => {
			return { playerId: playerId.toString(), value: parseInt(scoresFromForm[idx].toString()) };
		});

		const gameIdx = parseInt(params.gameIndex);

		updateGameScores(params.matchId, gameIdx, scores);

		return {
			success: true
		};
	}
} satisfies Actions;
