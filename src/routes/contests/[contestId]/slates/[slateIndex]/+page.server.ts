import { getSlate, updateGameScores } from '$lib/server/database/contests';
import type { Actions, PageServerLoad } from './$types';

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const matchIdFromForm = formData.getAll('matchId');
		const gameIndexFromForm = formData.getAll('gameIndex');
		const scoresFromForm = formData.getAll('scores');
		const playersFromForm = formData.getAll('players');

		const scores = playersFromForm.map((playerId, idx) => {
			return { playerId: playerId.toString(), value: parseInt(scoresFromForm[idx].toString()) };
		});

		const gameIdx = parseInt(gameIndexFromForm.toString());

		updateGameScores(matchIdFromForm.toString(), gameIdx, scores);

		return {
			success: true
		};
	}
} satisfies Actions;

export const load: PageServerLoad = ({ params }) => {
	const slateIndex = parseInt(params.slateIndex);
	const slate = getSlate(params.contestId, slateIndex);

	return { slate, slateIndex };
};
