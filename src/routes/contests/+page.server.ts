import { generateSlates, type GroupMethod } from '$lib/core';
import { createNewContest } from '$lib/server/database/contests';
import { createAppUser } from '$lib/server/database/users';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { v4 as uuid } from 'uuid';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();

		const contestName = data.get('contestName')?.toString() || 'New Contest';
		const groupMethodFromForm = data.get('groupMethod')?.toString() || '';
		const groupMethod: GroupMethod = ['random', 'grouped', 'alternating'].includes(
			groupMethodFromForm
		)
			? (groupMethodFromForm as GroupMethod)
			: 'alternating';
		const numGroupsStr = data.get('numGroups')?.toString() || '0';
		const gamesToWinStr = data.get('gamesToWin')?.toString() || '2';
		const playerNames = data.getAll('playerName');
		if (playerNames.length < 2) {
			return fail(422, {error: 'Must add at least two players.'})
		}
		const numGroups = parseInt(numGroupsStr);
		const players = playerNames.map((name) => ({
			name: name.toString(),
			id: uuid()
		}));

		const groupNames = Array.from({ length: numGroups }).map((_, idx) => `Group ${idx + 1}`);
		const userId = createAppUser({});

		const contestId = createNewContest({
			name: contestName,
			playersPerGame: 2,
			creatorId: userId,
			joinCode: Math.random().toString(36).substring(2, 7),
			players,
			slates: generateSlates(
				groupNames,
				players.map((p) => p.id),
				parseInt(gamesToWinStr),
				groupMethod
			)
		});

		return { success: true, contestId };
	}
} satisfies Actions;
