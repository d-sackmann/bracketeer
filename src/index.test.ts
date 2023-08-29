import { describe, it, expect } from 'vitest';
import {
	generateSlates,
	generateRoundRobinMatches,
	determineGameOutcome,
	type GameResult,
	determineMatchOutcome,
	type Venue,
	getIndividualResults,
	type Slate,
	type Match
} from '$lib/core';
import { arrayEquals, assertTrue } from '$lib/utils';

const mockPlayers = (numPlayers: number) => {
	return [
		{ id: 'a', name: 'paul', present: true, playing: false, rank: 1000 },
		{ id: 'b', name: 'joe', present: true, playing: false, rank: 2000 },
		{ id: 'c', name: 'mary', present: true, playing: false, rank: 3000 },
		{ id: 'd', name: 'ted', present: true, playing: false, rank: 4000 },
		{ id: 'e', name: 'zach', present: true, playing: false, rank: 5000 },
		{ id: 'f', name: 'glenn', present: true, playing: false, rank: 6000 },
		{ id: 'g', name: 'luis', present: true, playing: false, rank: 1500 },
		{ id: 'h', name: 'henry', present: true, playing: false, rank: 2500 },
		{ id: 'i', name: 'moe', present: true, playing: false, rank: 3500 },
		{ id: 'j', name: 'paulina', present: true, playing: false, rank: 4500 },
		{ id: 'k', name: 'esther', present: true, playing: false, rank: 5500 },
		{ id: 'l', name: 'keaton', present: true, playing: false, rank: 6500 },
		{ id: 'm', name: 'mike', present: true, playing: false, rank: 100 },
		{ id: 'n', name: 'andy', present: true, playing: false, rank: 200 },
		{ id: 'o', name: 'vincent', present: true, playing: false, rank: 300 },
		{ id: 'p', name: 'marcel', present: true, playing: false, rank: 400 }
	].slice(0, numPlayers);
};

describe('generateRoundRobinMatches', () => {
	it('generates matches for 1', () => {
		const result = generateRoundRobinMatches(mockPlayers(1), 3);
		expect(result.length).toBe(0);
	});

	it('generates matches for 2', () => {
		const result = generateRoundRobinMatches(mockPlayers(2), 3);
		expect(result.length).toBe(1);
	});

	it('generates matches for 3', () => {
		const result = generateRoundRobinMatches(mockPlayers(3), 3);
		expect(result.length).toBe(3);
	});

	it('generates matches for 4', () => {
		const result = generateRoundRobinMatches(mockPlayers(4), 3);
		expect(result.length).toBe(3 + 2 + 1);
	});

	it('generates matches for 16', () => {
		const result = generateRoundRobinMatches(mockPlayers(16), 3);
		expect(result.length).toBe(15 + 14 + 13 + 12 + 11 + 10 + 9 + 8 + 7 + 6 + 5 + 4 + 3 + 2 + 1);
	});
});

describe('generateSlates', () => {
	const mockVenues = (numVenues: number) => {
		return Array.from({ length: numVenues }, (v, k) => ({ name: `Table ${k + 1}` }));
	};
	it('should return an empty list if given no venues', () => {
		const result = generateSlates([], mockPlayers(16), 3);

		expect(result.length).toBe(0);
	});

	it('should return a slate per venue with an evenly divisible set of players', () => {
		const result = generateSlates(mockVenues(4), mockPlayers(16), 3);

		expect(result.length).toBe(4);

		expect(result[0].matches.length).toBe(6);
		expect(result[1].matches.length).toBe(6);
		expect(result[2].matches.length).toBe(6);
		expect(result[3].matches.length).toBe(6);
	});

	it('should return a slate for 16 players with 3 venues', () => {
		const result = generateSlates(mockVenues(3), mockPlayers(16), 3);

		expect(result.length).toBe(3);

		expect(result[0].matches.length).toBe(5 + 4 + 3 + 2 + 1);
		expect(result[1].matches.length).toBe(4 + 3 + 2 + 1);
		expect(result[2].matches.length).toBe(4 + 3 + 2 + 1);
	});

	it('should return a slate for 10 players with 3 venues', () => {
		const result = generateSlates(mockVenues(3), mockPlayers(10), 3);

		expect(result.length).toBe(3);

		expect(result[0].matches.length).toBe(3 + 2 + 1);
		expect(result[1].matches.length).toBe(2 + 1);
		expect(result[2].matches.length).toBe(2 + 1);
	});

	it('should return a slate for 7 players with 2 venues', () => {
		const result = generateSlates(mockVenues(2), mockPlayers(7), 3);

		expect(result.length).toBe(2);

		expect(result[0].matches.length).toBe(3 + 2 + 1);
		expect(result[1].matches.length).toBe(2 + 1);
	});
});

describe('determineGameOutcome', () => {
	it('should return undetermined when no one has hit the target score', () => {
		expect(determineGameOutcome(0, 0, 11, 2)).toBe('undetermined');
		expect(determineGameOutcome(9, 9, 11, 2)).toBe('undetermined');
		expect(determineGameOutcome(10, 0, 11, 2)).toBe('undetermined');
		expect(determineGameOutcome(10, 10, 11, 2)).toBe('undetermined');
		expect(determineGameOutcome(10, 20, 21, 2)).toBe('undetermined');
	});

	it('should return undetermined when the game is within the "win by margin"', () => {
		expect(determineGameOutcome(11, 10, 11, 2)).toBe('undetermined');
		expect(determineGameOutcome(11, 11, 11, 2)).toBe('undetermined');
		expect(determineGameOutcome(15, 16, 11, 2)).toBe('undetermined');
		expect(determineGameOutcome(12, 12, 11, 1)).toBe('undetermined');
	});

	it('should return win when the game is won', () => {
		expect(determineGameOutcome(11, 0, 11, 2)).toBe('win');
		expect(determineGameOutcome(11, 9, 11, 2)).toBe('win');
		expect(determineGameOutcome(13, 11, 11, 2)).toBe('win');
		expect(determineGameOutcome(18, 16, 11, 2)).toBe('win');
		expect(determineGameOutcome(11, 10, 11, 1)).toBe('win');
		expect(determineGameOutcome(21, 18, 21, 2)).toBe('win');
	});

	it('should return win when the game is lost', () => {
		expect(determineGameOutcome(0, 11, 11, 2)).toBe('loss');
		expect(determineGameOutcome(9, 11, 11, 2)).toBe('loss');
		expect(determineGameOutcome(11, 13, 11, 2)).toBe('loss');
		expect(determineGameOutcome(16, 18, 11, 2)).toBe('loss');
		expect(determineGameOutcome(10, 11, 11, 1)).toBe('loss');
		expect(determineGameOutcome(18, 21, 21, 2)).toBe('loss');
	});
});

describe('determineMatchOutcome', () => {
	const WIN: GameResult = {
		pointsWon: 11,
		pointsLost: 9,
		outcome: 'win'
	};
	const LOSS: GameResult = {
		pointsWon: 6,
		pointsLost: 11,
		outcome: 'loss'
	};

	const DRAW: GameResult = {
		pointsWon: 11,
		pointsLost: 11,
		outcome: 'draw'
	};

	const WIN_BY_FORFEIT: GameResult = {
		pointsWon: 0,
		pointsLost: 0,
		outcome: 'win_by_forfeit'
	};

	const FORFEIT: GameResult = {
		pointsWon: 0,
		pointsLost: 0,
		outcome: 'forfeit'
	};
	it('should include a tally of wins', () => {
		expect(determineMatchOutcome([], 3).gamesWon).toBe(0);
		expect(determineMatchOutcome([LOSS, WIN, WIN, WIN], 3).gamesWon).toBe(3);
		expect(determineMatchOutcome([LOSS, LOSS, WIN, WIN], 3).gamesWon).toBe(2);
		expect(determineMatchOutcome([LOSS, WIN, LOSS, WIN], 3).gamesWon).toBe(2);
		expect(determineMatchOutcome([LOSS, WIN_BY_FORFEIT, LOSS, WIN, FORFEIT], 3).gamesWon).toBe(2);
		expect(determineMatchOutcome([LOSS, WIN_BY_FORFEIT, LOSS, WIN, DRAW], 3).gamesWon).toBe(2);
		expect(determineMatchOutcome([LOSS, LOSS, LOSS, LOSS], 3).gamesWon).toBe(0);
	});

	it('should include a tally of losses', () => {
		expect(determineMatchOutcome([], 3).gamesLost).toBe(0);
		expect(determineMatchOutcome([LOSS, WIN, WIN, WIN], 3).gamesLost).toBe(1);
		expect(determineMatchOutcome([LOSS, LOSS, WIN, WIN], 3).gamesLost).toBe(2);
		expect(determineMatchOutcome([LOSS, WIN, LOSS, WIN], 3).gamesLost).toBe(2);
		expect(determineMatchOutcome([LOSS, WIN_BY_FORFEIT, LOSS, WIN, FORFEIT], 3).gamesLost).toBe(3);
		expect(determineMatchOutcome([LOSS, WIN_BY_FORFEIT, LOSS, WIN, DRAW], 3).gamesLost).toBe(2);
		expect(determineMatchOutcome([LOSS, LOSS, LOSS, LOSS], 3).gamesLost).toBe(4);
	});

	it('should have an undetermined outcome if no one has won enough games', () => {
		expect(determineMatchOutcome([], 3).outcome).toBe('undetermined');
		expect(determineMatchOutcome([WIN, LOSS], 3).outcome).toBe('undetermined');
		expect(determineMatchOutcome([WIN, LOSS, WIN, WIN], 4).outcome).toBe('undetermined');
	});

	it('should have an outcome of "win" if the player won', () => {
		expect(determineMatchOutcome([WIN, LOSS, WIN, WIN], 3).outcome).toBe('win');
		expect(determineMatchOutcome([WIN, LOSS, WIN, WIN, WIN], 4).outcome).toBe('win');
	});

	it('should have an outcome of "loss" if the player lost', () => {
		expect(determineMatchOutcome([LOSS, WIN, LOSS, LOSS], 3).outcome).toBe('loss');
		expect(determineMatchOutcome([LOSS, WIN, LOSS, LOSS, LOSS], 4).outcome).toBe('loss');
	});

	it('should have an outcome of "draw" if the match is a draw', () => {
		expect(determineMatchOutcome([LOSS, WIN, LOSS, LOSS, WIN, WIN], 3).outcome).toBe('draw');
		expect(determineMatchOutcome([LOSS, WIN], 1).outcome).toBe('draw');
	});
});

describe('getIndividualResults', () => {
	function findMatchBetweenPlayers(slate: Slate, players: string[]): Match {
		const match = slate.matches.find((m) => arrayEquals(m.players, players));

		assertTrue(!!match, `No match has these players: ${players.join(', ')}`);

		return match;
	}

	function setScore(slate: Slate, gameIdx: number, scores: { [key: string]: number }) {
		const match = findMatchBetweenPlayers(slate, Object.keys(scores));

		match.players.forEach((playerId, idx) => {
			match.games[gameIdx].score[idx] = scores[playerId];
		});
	}

	it('should return the match results for a player', () => {
		const venue: Venue = { name: 'Table 1' };

		const players = mockPlayers(4);
		const [slate] = generateSlates([venue], players, 3);

		setScore(slate, 0, { a: 11, b: 0 });
		setScore(slate, 1, { a: 11, b: 0 });
		setScore(slate, 2, { a: 11, b: 0 });

		setScore(slate, 0, { a: 11, c: 0 });
		setScore(slate, 1, { a: 11, c: 0 });
		setScore(slate, 2, { a: 11, c: 11 });

		setScore(slate, 0, { a: 0, d: 11 });
		setScore(slate, 1, { a: 11, d: 1 });
		setScore(slate, 2, { a: 13, d: 11 });
		setScore(slate, 3, { a: 2, d: 11 });
		setScore(slate, 4, { a: 2, d: 11 });

		const playerA = players.find((p) => p.id === 'a');

		assertTrue(!!playerA);
		const result = getIndividualResults(playerA, slate);

		expect(result.length).toBe(3);

		const aVsB = findMatchBetweenPlayers(slate, ['a', 'b']);
		const aVsC = findMatchBetweenPlayers(slate, ['a', 'c']);
		const aVsD = findMatchBetweenPlayers(slate, ['a', 'd']);

		expect(result.find((m) => m.matchId === aVsB.id)?.gamesWon).toBe(3);
		expect(result.find((m) => m.matchId === aVsB.id)?.gamesLost).toBe(0);
		expect(result.find((m) => m.matchId === aVsB.id)?.outcome).toBe('win');

		expect(result.find((m) => m.matchId === aVsC.id)?.gamesWon).toBe(2);
		expect(result.find((m) => m.matchId === aVsC.id)?.gamesLost).toBe(0);
		expect(result.find((m) => m.matchId === aVsC.id)?.outcome).toBe('undetermined');

		expect(result.find((m) => m.matchId === aVsD.id)?.gamesWon).toBe(2);
		expect(result.find((m) => m.matchId === aVsD.id)?.gamesLost).toBe(3);
		expect(result.find((m) => m.matchId === aVsD.id)?.outcome).toBe('loss');
	});
});
