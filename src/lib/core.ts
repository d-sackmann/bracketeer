import { v4 as uuid } from 'uuid';
import { assertTrue, sum, tally } from '$lib/utils';

export type Venue = {
	name: string;
};

export type Game = {
	score: number[];
};

export type Player = {
	id: string;
	name: string;
};

export type Match = {
	id: string;
	players: string[];
	games: Game[];
};

export type Slate = {
	players: string[];
	id: string;
	name: string;
	matches: Match[];
	gamesToWin: number;
};

export type Contest = {
	name: string;
	slates: Slate[];
	playersPerGame: number;
	joinCode: string;
};

export function generatePlayer(name: string) {
	return {
		name,
		id: uuid()
	};
}

function generateGames(gamesToWin: number): Game[] {
	return Array.from({ length: gamesToWin * 2 - 1 }).map(() => ({
		score: [0, 0],
		id: uuid()
	}));
}

function generateMatch(players: string[], gamesToWin: number): Match {
	return {
		id: uuid(),
		players,
		games: generateGames(gamesToWin)
	};
}

export function generateRoundRobinMatches(players: string[], gamesToWin: number): Match[] {
	let matches: Match[] = [];
	for (let i = 0; i < players.length; i++) {
		matches = matches.concat(
			players.slice(i + 1).map((opponent) => generateMatch([players[i], opponent], gamesToWin))
		);
	}

	return matches;
}

export function generateSlates(
	groupNames: string[],
	players: string[],
	gamesToWin: number
): Slate[] {
	return groupNames.map((groupName, venueIdx) => {
		const playersForVenue = players.filter((_, playerIdx) => {
			return (playerIdx + venueIdx) % groupNames.length === 0;
		});

		return {
			id: uuid(),
			players: playersForVenue,
			gamesToWin: gamesToWin,
			name: groupName,
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
	opponents: string[];
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

export function getIndividualResults(player: string, slate: Slate): MatchResult[] {
	const matches = slate.matches.filter((match) => match.players.includes(player));

	return matches.map((match) => {
		const playerScoreIdx = match.players.indexOf(player);
		assertTrue(playerScoreIdx !== -1, `Match ${match.id} has no such player ${player}`);

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
			matchId: match.id,
			opponents: match.players.filter((id) => id !== player)
		};
	});
}

type MatchResultsComparison = {
	value: number;
	rule: 'matches' | 'games' | 'points' | 'head2head' | 'default';
};
export function resultComparator(a: MatchResult[], b: MatchResult[]): MatchResultsComparison {
	// If one player has more wins than the other, they win
	const [aMatchWins, bMatchWins] = [a, b].map((result) =>
		tally(result, (r) => WIN_OUTCOMES.includes(r.outcome))
	);
	const winDiff = bMatchWins - aMatchWins;
	if (winDiff !== 0) {
		return {
			value: winDiff,
			rule: 'matches'
		};
	}

	// If players won the same amount of matches, the winner is whoever dropped fewer games
	// Comparison is a - b here because it's better to have fewer losses
	const [aGamesLost, bGamesLost] = [a, b].map((result) =>
		sum(result.map(({ gamesLost }) => gamesLost))
	);
	const gamesLostDiff = aGamesLost - bGamesLost;
	if (gamesLostDiff !== 0) {
		return {
			value: gamesLostDiff,
			rule: 'games'
		};
	}

	// If the players dropped the same number of games, the winner is whoever had the highest point differential
	const [aPointDifferential, bPointDifferential] = [a, b].map((results) =>
		sum(results.map((r) => sum(r.games.map((g) => g.pointsWon - g.pointsLost))))
	);
	const pointDifferentialDiff = bPointDifferential - aPointDifferential;
	if (pointDifferentialDiff !== 0) {
		return {
			value: pointDifferentialDiff,
			rule: 'points'
		};
	}

	// Finally, the winner is whichever player won the match between the two
	const head2HeadMatch = a.find((resultForA) =>
		b.map((resultForB) => resultForB.matchId).includes(resultForA.matchId)
	);
	if (head2HeadMatch) {
		if (WIN_OUTCOMES.includes(head2HeadMatch.outcome)) {
			return {
				value: -1,
				rule: 'head2head'
			};
		}
		if (LOSS_OUTCOMES.includes(head2HeadMatch.outcome)) {
			return {
				value: 1,
				rule: 'head2head'
			};
		}
	}

	// If there's still no winner, the match results are equivalent
	return {
		value: 0,
		rule: 'default'
	};
}
