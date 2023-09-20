import { listContests } from '$lib/server/database/contests';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = () => {
	return {
		contests: listContests()
	};
};
