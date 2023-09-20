import { v4 as uuid } from 'uuid';
import getDatabase from './initializeDb';
import {
	createAppUserStmt,
	createContestOwnershipStmt,
	createContestStmt,
	createGameScoreStatement,
	createMatchPlayerStmt,
	createMatchStmt,
	createPlayerStmt,
	createSlateStmt,
	getFullContestStmt,
	getPlayerForContestStmt,
	type GetFullContestStmtRow,
	type GetPlayersRow,
	listContestsStmt,
	type ContestListRow,
	createGameStmt
} from './statements';
import type { Contest, Player, Slate } from '$lib/core';

type NewMatch = {
	id: string;
	players: string[];
};
type NewSlate = {
	gamesToWin: number;
	matches: NewMatch[];
	name: string;
};
type NewPlayer = {
	id: string;
	name: string;
};
type NewContest = {
	name: string;
	playersPerGame: number;
	creatorId: string;
	joinCode: string;
	players: NewPlayer[];
	slates: NewSlate[];
};

type NewUser = object;
export function createAppUser(_userData: NewUser) {
	const userId = uuid();
	createAppUserStmt.run({ id: userId });

	return userId;
}

export function createNewContest(contestData: NewContest) {
	const contestId = uuid();
	const tx = getDatabase().transaction(() => {
		// Create the contest record
		createContestStmt.run({
			id: contestId,
			name: contestData.name,
			playersPerGame: contestData.playersPerGame,
			joinCode: contestData.joinCode
		});

		contestData.players.forEach((playerData) => {
			createPlayerStmt.run({ id: playerData.id, name: playerData.name });
		});

		// for each slate, create the slate record
		contestData.slates.forEach((slateData, slateIdx) => {
			const slateId = uuid();
			createSlateStmt.run({
				id: slateId,
				idx: slateIdx,
				contestId,
				gamesToWin: slateData.gamesToWin,
				name: slateData.name
			});

			// For each match, create a match record
			slateData.matches.forEach((matchData, matchIdx) => {
				createMatchStmt.run({
					id: matchData.id,
					idx: matchIdx,
					slateId
				});

				matchData.players.forEach((playerData, idx) => {
					createMatchPlayerStmt.run({ matchId: matchData.id, playerId: playerData, idx });
				});

				const numGames = slateData.gamesToWin * 2 - 1;
				for (let i = 0; i < numGames; i++) {
					createGameStmt.run({ matchId: matchData.id, idx: i });
					createGameScoreStatement.run({
						matchId: matchData.id,
						gameIdx: i,
						playerId: matchData.players[0],
						value: 0
					});
					createGameScoreStatement.run({
						matchId: matchData.id,
						gameIdx: i,
						playerId: matchData.players[1],
						value: 0
					});
				}
			});
		});

		createContestOwnershipStmt.run({ contestId, appUserId: contestData.creatorId });
	});

	try {
		tx();
	} catch (e) {
		console.error(e);
		throw e;
	}
	return contestId;
}

export function getContest(contestId: string): Contest {
	const contestRows = getFullContestStmt.all({ contestId }) as GetFullContestStmtRow[];

	if (contestRows.length < 1) {
		throw new Error(`No contest found with id ${contestId}`);
	}
	return {
		name: contestRows[0].contestName,
		playersPerGame: contestRows[0].playersPerGame,
		joinCode: contestRows[0].joinCode,
		slates: contestRows.reduce((slates, row) => {
			const lastSlate = slates[slates.length - 1];
			const slateExists = lastSlate?.id === row.slateId;
			const slateForRow: Slate = slateExists
				? lastSlate
				: {
						id: row.slateId,
						name: row.slateName,
						gamesToWin: row.gamesToWin,
						matches: [],
						players: []
				  };

			if (slateForRow.matches.length <= row.matchIdx) {
				slateForRow.matches.push({
					id: row.matchId,
					players: [row.player1Id, row.player2Id],
					games: []
				});
			}

			const match = slateForRow.matches[slateForRow.matches.length - 1];
			match.games.push({ score: [row.player1Score || 0, row.player2Score || 0] });

			[row.player1Id, row.player2Id].forEach((playerId) => {
				if (!slateForRow.players.includes(playerId)) {
					slateForRow.players.push(playerId);
				}
			});

			if (!slateExists) {
				slates.push(slateForRow);
			}
			return slates;
		}, [] as Slate[])
	};
}

export function getPlayersForContest(contestId: string): Player[] {
	const players = getPlayerForContestStmt.all({ contestId }) as GetPlayersRow[];

	if (!players) {
		return [];
	}

	return players;
}

type ContestListEntry = {
	name: string;
	id: string;
	createdAt: Date;
};
export function listContests(): ContestListEntry[] {
	const rows: ContestListRow[] = listContestsStmt.all() as ContestListRow[];
	return rows.map(({ createdAt, ...rest }) => {
		return {
			createdAt: new Date(createdAt),
			...rest
		};
	});
}

export function updateGameScores(
	matchId: string,
	gameIdx: number,
	scores: { playerId: string; value: number }[]
) {
	getDatabase().transaction(() => {
		scores.forEach(({ playerId, value }) => {
			createGameScoreStatement.run({ matchId, gameIdx, playerId, value });
		});
	})();
}
