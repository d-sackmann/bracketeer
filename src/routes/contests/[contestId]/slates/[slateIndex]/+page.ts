import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async (event) => {
	const slateIndex = parseInt(event.params.slateIndex);

	const parent = await event.parent();
	if (!(slateIndex >= 0 && slateIndex < parent.contest.slates.length)) {
		console.error('Invalid slate index');
		throw error(404);
	}
	return {
		slateIndex
	};
};
