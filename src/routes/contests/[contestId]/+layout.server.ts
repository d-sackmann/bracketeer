import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getContest, getPlayersForContest } from '$lib/server/database/contests';

export const load: LayoutServerLoad = async ({ params }) => {
	let contest, players;

	try {
		contest = getContest(params.contestId);
	} catch (e) {
		console.error(`Error retrieving contest data ${e}`);
		throw error(404, 'Not found');
	}

	try {
		players = getPlayersForContest(params.contestId);
	} catch (e) {
		console.error(`Error retrieving player data ${e}`);
		throw error(404, 'Not found');
	}

	return { contest, players, contestId: params.contestId };
};
