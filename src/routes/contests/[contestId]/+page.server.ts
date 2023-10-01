import type { PageServerLoad } from './$types';
import { getContest } from '$lib/server/database/contests';

export const load: PageServerLoad = (event) => {
	const fullContest = getContest(event.params.contestId);

	return { fullContest };
};
