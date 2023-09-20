import type { Statement } from 'better-sqlite3';
import type BetterSQLite3 from 'better-sqlite3';
import initializeDb from './initializeDb';

const statementFactory = (s: (db: BetterSQLite3.Database) => Statement) => {
	return s(initializeDb());
};

export const createAppUserStmt = statementFactory((db) =>
	db.prepare(`INSERT INTO appUser(id) VALUES (:id)`)
);
export const createPlayerStmt = statementFactory((db) =>
	db.prepare(`INSERT INTO player(id, name) VALUES(:id, :name)`)
);
export const createContestOwnershipStmt = statementFactory((db) =>
	db.prepare(`INSERT INTO contestOwnership(contestId, appUserId) 
VALUES (:contestId, :appUserId)`)
);
export const createMatchStmt = statementFactory((db) =>
	db.prepare(
		`INSERT INTO match(id, slateId, idx)
                    VALUES (:id, :slateId, :idx)`
	)
);

export const createMatchPlayerStmt = statementFactory((db) =>
	db.prepare(
		`INSERT INTO matchPlayer(matchId, playerId, idx)
                    VALUES (:matchId, :playerId, :idx)`
	)
);

export const createSlateStmt = statementFactory((db) =>
	db.prepare(
		`INSERT INTO slate(id, contestId, gamesToWin, name, idx)
                VAlUES (:id, :contestId, :gamesToWin, :name, :idx)`
	)
);

export const createContestStmt = statementFactory((db) =>
	db.prepare(`INSERT INTO contest (id, name, playersPerGame, joinCode) 
VALUES (:id, :name, :playersPerGame, :joinCode)`)
);

export type GetPlayersRow = {
	id: string;
	name: string;
};
export const getPlayerForContestStmt = statementFactory((db) =>
	db.prepare(
		`
	SELECT
p.name,
p.id
from player  p
where p.id in (
	Select matchPlayer.playerId from contest
	inner join slate on slate.contestId = contest.id
	inner join match on match.slateId = slate.id
	inner join matchPlayer on matchPlayer.matchId = match.id
	where contest.id= :contestId
)
order by p.name`
	)
);

export type GetFullContestStmtRow = {
	contestId: string;
	contestName: string;
	slateName: string;
	slateId: string;
	gamesToWin: number;
	playersPerGame: number;
	joinCode: string;
	matchId: string;
	matchIdx: number;
	player1Id: string;
	player2Id: string;
	player1Name: string;
	player2Name: string;
	player1Score: number | null;
	player2Score: number | null;
	gameIdx: number | null;
};
export const getFullContestStmt = statementFactory((db) =>
	db.prepare(`
	select contest.id contestId,
    contest.name contestName,
    contest.playersPerGame playersPerGame,
	contest.joinCode joinCode,
    slate.name slateName,
    slate.id slateId,
	slate.gamesToWin gamesToWin,
    slate.idx slateIdx,
    match.id matchId,
    match.idx matchIdx,
    mPlayer1.playerId player1Id,
    mPlayer2.playerId player2Id,
    player1.name player1Name,
    player2.name player2Name,
	gameScore1.value as player1Score,
	gameScore2.value as player2Score,
	game.idx as gameIdx
from match
    inner join matchPlayer as mPlayer1 on (
        mPlayer1.matchId = match.id
        and mPlayer1.idx = 0
    )
    inner join matchPlayer as mPlayer2 on (
        mPlayer2.matchId = match.id
        and mPlayer2.idx = 1
    )
    inner join player as player1 on mplayer1.playerId = player1.id
    inner join player as player2 on mplayer2.playerId = player2.id
    inner join slate on slate.id = match.slateId
    inner join contest on slate.contestId = contest.id
	inner join game on game.matchId = match.id
	inner join gameScore as gameScore1 on (gameScore1.playerId = player1.id AND gameScore1.gameIdx = game.idx AND gameScore1.matchId = match.id) 
	inner join gameScore as gameScore2 on (gameScore2.playerId = player2.id AND gameScore2.gameIdx = game.idx AND gameScore2.matchId = match.id) 
where contestId = :contestId
order by slateIdx,
    matchIdx, gameIdx
;
	`)
);

export type ContestListRow = {
	name: string;
	id: string;
	createdAt: string;
};
export const listContestsStmt = statementFactory((db) =>
	db.prepare(`SELECT id, name, createdAt from contest order by createdAt DESC`)
);

export const createGameStmt = statementFactory((db) =>
	db.prepare(`INSERT INTO game(matchId, idx) values (:matchId, :idx)`)
);

export const createGameScoreStatement = statementFactory((db) =>
	db.prepare(
		`INSERT INTO gameScore (matchId, gameIdx, playerId, value) VALUES (:matchId, :gameIdx, :playerId, :value) ON CONFLICT DO UPDATE set value = :value`
	)
);
