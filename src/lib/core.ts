import { v4 as uuid } from 'uuid';
import { assertTrue, sum, tally } from './utils';

export type Venue = {
	name: string;
};

export type Game = {
	score: number[];
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
	players: string[];
	games: Game[];
};

export type Slate = {
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

function generateGames(gamesToWin: number): Game[] {
	return Array.from({ length: gamesToWin * 2 - 1 }).map(() => ({
		score: [0, 0]
	}));
}

function generateMatch(players: Player[], gamesToWin: number): Match {
	return {
		id: uuid(),
		players: players.map((p) => p.id),
		games: generateGames(gamesToWin)
	};
}

export function generateRoundRobinMatches(players: Player[], gamesToWin: number): Match[] {
	let matches: Match[] = [];
	for (let i = 0; i < players.length; i++) {
		matches = matches.concat(
			players.slice(i + 1).map((opponent) => generateMatch([players[i], opponent], gamesToWin))
		);
	}

	return matches;
}

export function generateSlates(venues: Venue[], players: Player[], gamesToWin: number): Slate[] {
	players.sort((a, b) => (b.rank || 0) - (a.rank || 0));

	return venues.map((venue, venueIdx) => {
		const playersForVenue = players.filter((_, playerIdx) => {
			return (playerIdx + venueIdx) % venues.length === 0;
		});

		return {
			gamesToWin,
			venue,
			matches: generateRoundRobinMatches(playersForVenue, gamesToWin)
		};
	});
}

type Outcome =
	| 'win'
	| 'loss'
	| 'draw'
	| 'forfeit'
	| 'win_by_forfeit'
	| 'undetermined'
	| 'unnecessary';

const WIN_OUTCOMES: Outcome[] = ['win', 'win_by_forfeit'];
const LOSS_OUTCOMES: Outcome[] = ['loss', 'forfeit'];

export type GameResult = {
	pointsWon: number;
	pointsLost: number;
	outcome: Outcome;
};
export type MatchResult = {
	matchId: string;
	outcome: Outcome;
	gamesWon: number;
	gamesLost: number;
	games: GameResult[];
};

export function determineGameOutcome(
	pointsWon: number,
	pointsLost: number,
	target = 11,
	winBy = 2
): Outcome {
	let outcome: Outcome = 'undetermined';

	assertTrue(winBy > 0, `Non-positive "win-by" value ${winBy}`);

	if (pointsWon >= target || pointsLost >= target) {
		if (pointsWon - pointsLost >= winBy) {
			outcome = 'win';
		} else if (pointsLost - pointsWon >= winBy) {
			outcome = 'loss';
		}
	}
	return outcome;
}

export function determineMatchOutcome(games: GameResult[], gamesToWin: number) {
	let outcome: Outcome = 'undetermined';

	const gamesWon = tally<GameResult>(games, (g) => WIN_OUTCOMES.includes(g.outcome));
	const gamesLost = tally<GameResult>(games, (g) => LOSS_OUTCOMES.includes(g.outcome));

	if (gamesWon >= gamesToWin || gamesLost >= gamesToWin) {
		if (gamesWon > gamesLost) {
			outcome = 'win';
		} else if (gamesLost > gamesWon) {
			outcome = 'loss';
		} else {
			outcome = 'draw';
		}
	}

	return {
		gamesWon,
		gamesLost,
		outcome,
		games
	};
}

export function getIndividualResults(player: Player, slate: Slate): MatchResult[] {
	const matches = slate.matches.filter((match) => match.players.includes(player.id));

	return matches.map((match) => {
		const playerScoreIdx = match.players.indexOf(player.id);
		assertTrue(playerScoreIdx !== -1, `Match ${match.id} has no such player ${player.id}`);

		const gameResults: GameResult[] = match.games.map((game) => {
			const pointsWon = game.score[playerScoreIdx];
			const pointsLost = sum(game.score.filter((_, idx) => idx !== playerScoreIdx));

			return {
				outcome: determineGameOutcome(pointsWon, pointsLost),
				pointsWon,
				pointsLost
			};
		});

		return {
			...determineMatchOutcome(gameResults, slate.gamesToWin),
			matchId: match.id
		};
	});
}

export function getResults(slate: Slate, players: Player[]): MatchResult[][] {
	return players.map((player) => {
		return getIndividualResults(player, slate);
	});
}
