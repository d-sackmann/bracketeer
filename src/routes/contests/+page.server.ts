import { generateSlates } from '$lib/core';
import { createNewContest, createAppUser } from '$lib/server/database';
import type { Actions } from './$types';
import { v4 as uuid } from 'uuid';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();

		const contestName = data.get('contestName')?.toString() || 'New Contest';
		const numGroupsStr = data.get('numGroups')?.toString() || '0';
		const gamesToWinStr = data.get('gamesToWin')?.toString() || '2';
		const playerNames = data.getAll('playerName');
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
				parseInt(gamesToWinStr)
			)
		});

		return { success: true, contestId };
	}
} satisfies Actions;
