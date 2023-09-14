import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getContest, getPlayersForContest } from '$lib/server/database';

export const load: PageServerLoad = async ({ params }) => {
	let contest, players;

	try {
		contest = getContest(params.slug);
	} catch (e) {
		console.error(`Error retrieving contest data ${e}`);
		throw error(404, 'Not found');
	}

	try {
		players = getPlayersForContest(params.slug);
	} catch (e) {
		console.error(`Error retrieving player data ${e}`);
		throw error(404, 'Not found');
	}

	return { contest, players };
};
