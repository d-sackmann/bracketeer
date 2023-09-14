import { createAppUser } from '$lib/server/database';
import type { Actions } from './$types';

export const actions = {
	default: async () => {
		const userId = await createAppUser({});

		return {
			success: true,
			userId
		};
	}
} satisfies Actions;
