import { describe, it, expect } from 'vitest';
import { v4 as uuid } from 'uuid';
import getDatabase from './initializeDb';
import { createNewContest, getContest } from './contests';
import { createAppUser } from './users';

const contestSetup = () => {
	const userId = createAppUser({});

	const playerIds = Array.from({ length: 6 }).map(() => uuid());
	const matchIds = Array.from({ length: 6 }).map(() => uuid());
	const contestId = createNewContest({
		name: 'Test contest',
		playersPerGame: 3,
		creatorId: userId,
		joinCode: 'LOLXD',
		players: playerIds.map((id, index) => ({ id, name: `Test player ${index}` })),
		slates: [
			{
				gamesToWin: 4,
				name: 'Group 1',
				matches: [
					{
						id: matchIds[0],
						players: [playerIds[0], playerIds[1]]
					},
					{
						id: matchIds[1],
						players: [playerIds[0], playerIds[2]]
					},
					{
						id: matchIds[2],
						players: [playerIds[1], playerIds[2]]
					}
				]
			},
			{
				gamesToWin: 3,
				name: 'Group 2',
				matches: [
					{
						id: matchIds[3],
						players: [playerIds[3], playerIds[4]]
					},
					{
						id: matchIds[4],
						players: [playerIds[3], playerIds[5]]
					},
					{
						id: matchIds[5],
						players: [playerIds[4], playerIds[5]]
					}
				]
			}
		]
	});

	return {
		userId,
		matchIds,
		playerIds,
		contestId
	};
};

describe('createNewContest', () => {
	it('should create all the rows representing the contest', () => {
		const { userId, contestId, playerIds, matchIds } = contestSetup();

		const contestRow = getDatabase()
			.prepare('SELECT id, name, playersPerGame, joinCode FROM contest where id = :contestId')
			.get({ contestId }) as { id: string; name: string; joinCode: string; playersPerGame: string };

		expect(contestRow).toBeDefined();
		expect(contestRow.id).toBe(contestId);
		expect(contestRow.name).toBe('Test contest');
		expect(contestRow.joinCode).toBe('LOLXD');
		expect(contestRow.playersPerGame).toBe(3);

		const playerRows = getDatabase()
			.prepare(`SELECT id from player where id in (${playerIds.map(() => '?').join(', ')})`)
			.all(playerIds);

		expect(playerRows).toBeDefined();
		expect(playerRows.length).toBe(playerIds.length);

		const slateRows = getDatabase()
			.prepare(
				`SELECT id, name, gamesToWin, idx FROM slate where contestId = :contestId ORDER BY idx`
			)
			.all({ contestId }) as { id: string; name: string; gamesToWin: number; idx: number }[];

		expect(slateRows).toBeDefined();
		expect(slateRows.length).toBe(2);

		expect(slateRows[0].name).toBe('Group 1');
		expect(slateRows[1].name).toBe('Group 2');
		expect(slateRows[0].idx).toBe(0);
		expect(slateRows[1].idx).toBe(1);
		expect(slateRows[0].gamesToWin).toBe(4);
		expect(slateRows[1].gamesToWin).toBe(3);

		slateRows.forEach((slateRow, slateIdx) => {
			const matchRows = getDatabase()
				.prepare(`SELECT id, idx FROM match WHERE slateId = :slateId ORDER BY idx`)
				.all({ slateId: slateRow.id }) as { id: string; idx: number }[];

			expect(matchRows).toBeDefined();
			expect(matchRows.length).toBe(3);

			expect(matchRows.map((r) => r.id)).toEqual(matchIds.slice(slateIdx * 3, slateIdx * 3 + 3));
			expect(matchRows.map((r) => r.idx)).toEqual([0, 1, 2]);

			matchRows.forEach((matchRow) => {
				const matchPlayerRows = getDatabase()
					.prepare(
						`SELECT matchId, playerId, idx FROM matchPlayer WHERE matchId = :matchId ORDER BY idx`
					)
					.all({ matchId: matchRow.id }) as { matchId: string; playerId: string; idx: number }[];

				expect(matchPlayerRows).toBeDefined();
				expect(matchPlayerRows.length).toBe(2);

				const gameRows = getDatabase()
					.prepare(`SELECT matchId, idx FROM game where matchId = :matchId order by idx`)
					.all({ matchId: matchRow.id });
				expect(gameRows).toBeDefined();
				expect(gameRows.length).toBe(slateRow.gamesToWin * 2 - 1);

				gameRows.forEach((_, gameRowIdx) => {
					const scoreRows = getDatabase()
						.prepare(
							`SELECT matchId, gameIdx, playerId FROM gameScore where matchId = :matchId and gameIdx = :idx`
						)
						.all({ matchId: matchRow.id, idx: gameRowIdx });
					expect(scoreRows).toBeDefined();
					expect(scoreRows.length).toBe(2);
				});
			});
		});

		const ownershipRow = getDatabase()
			.prepare(
				'SELECT appUserId, contestId FROM contestOwnership WHERE appUserId = :userId AND contestId = :contestId'
			)
			.all({ userId, contestId });

		expect(ownershipRow).toBeDefined();
		expect(ownershipRow.length).toBe(1);
	});
});

describe('getContestById', () => {
	it('should return a wide table representing the contest', () => {
		const { contestId } = contestSetup();

		const result = getContest(contestId);

		expect(result).toBeDefined();

		expect(result.slates[0].matches[0].games.length).toBe(7);
	});
});
