import { v4 as uuid } from 'uuid';

type Event = {
	name: string;
	slates: Slate[][];
	playersPerGame: number;
};

type Venue = {
	name: string;
};

export type Game = {
	score: number[];
	complete: boolean;
	playerCount: number;
};

export type Player = {
	id: string;
	name: string;
	present: boolean;
	playing: boolean;
	rank?: number;
};

export type Match = {
	id: string;
	displayName: string;
	players: Player[];
	games: Game[];
	gamesToWin: number;
};

type Slate = {
	venue: Venue;
	matches: Match[];
	gamesToWin: number;
};

export function generatePlayer(name: string) {
	return {
		name,
		id: uuid(),
		present: true,
		playing: false
	};
}

function generateMatchId() {
	return uuid();
}

function findIndicesOfMaxValues(numbers: number[]): number[] {
	if (numbers.length === 0) {
		return [];
	}

	let maxIndices: number[] = [0];
	let maxValue = numbers[0];

	for (let i = 1; i < numbers.length; i++) {
		if (numbers[i] > maxValue) {
			maxIndices = [i];
			maxValue = numbers[i];
		} else if (numbers[i] === maxValue) {
			maxIndices.push(i);
		}
	}

	return maxIndices;
}

function getMatchWinnerIdx(games: Game[], gamesToWin: number) {
	const highScoreIndices = games.map((g) => findIndicesOfMaxValues(g.score));

	const wins = highScoreIndices.reduce((acc, indices) => {
		if (indices.length !== 1) {
			return acc;
		}
		acc[indices[0]] = (acc[indices[0]] || 0) + 1;
		return acc;
	}, [] as number[]);

	return wins.findIndex((x) => x >= gamesToWin);
}

function generateGames(gamesToWin: number, playerCount: number): Game[] {
	return Array.from({ length: gamesToWin * 2 - 1 }).map(() => ({
		score: [0, 0],
		complete: false,
		playerCount
	}));
}

function generateMatch(players: Player[], gamesToWin: number, playerCount: number): Match {
	return {
		id: uuid(),
		displayName: players.map((p) => p.name).join(' vs. '),
		players,
		games: generateGames(gamesToWin, playerCount),
		gamesToWin
	};
}

export function generateRoundRobinMatches(
	players: Player[],
	gamesToWin: number,
	playerCount = 2
): Match[] {
	let matches: Match[] = [];
	for (let i = 0; i < players.length; i++) {
		matches = matches.concat(
			players
				.slice(i + 1)
				.map((opponent) => generateMatch([players[i], opponent], gamesToWin, playerCount))
		);
	}

	return matches;
}

export function generateSlates(
	venues: Venue[],
	players: Player[],
	gamesToWin: number,
	playerCount = 2
): Slate[] {
	players.sort((a, b) => (b.rank || 0) - (a.rank || 0));

	return venues.map((venue, venueIdx) => {
		const playersForVenue = players.filter((_, playerIdx) => {
			return (playerIdx + venueIdx) % venues.length === 0;
		});

		return {
			gamesToWin,
			venue,
			matches: generateRoundRobinMatches(playersForVenue, gamesToWin, playerCount)
		};
	});
}
