import { env } from '$env/dynamic/private';
import BetterSQLite3 from 'better-sqlite3';

let database: BetterSQLite3.Database | null = null;

const schemaSql = `
CREATE TABLE IF NOT EXISTS player (
    id varchar(36) PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS contest (
    id varchar(36) PRIMARY KEY,
    name TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    playersPerGame INTEGER DEFAULT 2 NOT NULL,
    joinCode varchar(6) NOT NULL
);

CREATE TABLE IF NOT EXISTS appUser (
    id varchar(36) PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS appSession (
    id varchar(36) PRIMARY KEY,
    userId varchar(36),
    FOREIGN KEY (userId) references appUser (id)
);

CREATE TABLE IF NOT EXISTS contestOwnership (
    appUserId varchar(36) NOT NULL,
    contestId varchar(36) NOT NULL,
    PRIMARY KEY (appUserId, contestId),
    FOREIGN KEY (appUserId) references appUser(id),
    FOREIGN KEY (contestId) references contest(id)
);

CREATE TABLE IF NOT EXISTS slate (
    id varchar(36) PRIMARY KEY,
    name TEXT NOT NULL,
    contestId varchar(36) NOT NULL,
    idx INTEGER NOT NULL,
    gamesToWin INTEGER DEFAULT 3 NOT NULL,
    FOREIGN KEY (contestId) references contest(id)
);
CREATE UNIQUE INDEX IF NOT EXISTS slateIdx on slate(contestId, idx);


CREATE TABLE IF NOT EXISTS match (
    id varchar(36) PRIMARY KEY,
    slateId varchar(36) NOT NULL,
    idx INTEGER NOT NULL,
    FOREIGN KEY (slateId) references slate(id)
);

CREATE UNIQUE INDEX IF NOT EXISTS matchIdx on match(slateId, idx);


CREATE TABLE IF NOT EXISTS game (
    matchId varchar(36) NOT NULL,
    idx INTEGER NOT NULL,
    PRIMARY KEY (matchId, idx),
    FOREIGN KEY (matchId) references match(id)
);

CREATE UNIQUE INDEX IF NOT EXISTS gameIdx on game(matchId, idx);


CREATE TABLE IF NOT EXISTS player (
    id varchar(36) PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS matchPlayer (
    matchId varchar(36) NOT NULL,
    playerId varchar(36) NOT NULL,
    idx INTEGER NOT NULL,
    PRIMARY KEY (matchId, playerId)
);

CREATE UNIQUE INDEX IF NOT EXISTS matchPlayerIdx on matchPlayer(matchId, idx);

CREATE TABLE IF NOT EXISTS gameScore (
    gameId varchar(36) NOT NULL,
    playerId varchar(36) NOT NULL,
    value INTEGER DEFAULT 0 NOT NULL,
    PRIMARY KEY (gameId, playerId),
    FOREIGN KEY (gameId) references game(id),
    FOREIGN KEY (playerId) references player(id)
);
`;

export default function (): BetterSQLite3.Database {
	if (database) {
		return database;
	}
	database = new BetterSQLite3(env.DB_NAME);
	database.pragma('journal_mode = WAL');
	database.pragma('foreign_keys = ON');
	database.exec(schemaSql);

	console.log('Database initialization complete');

	return database;
}
