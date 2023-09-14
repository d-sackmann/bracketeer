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
CREATE TABLE IF NOT EXISTS appUser (id varchar(36) PRIMARY KEY);
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
    gamesToWin INTEGER DEFAULT 3 NOT NULL,
    FOREIGN KEY (contestId) references contest(id)
);
CREATE TABLE IF NOT EXISTS match (
    id varchar(36) PRIMARY KEY,
    slateId varchar(36) NOT NULL,
    FOREIGN KEY (slateId) references slate(id)
);
CREATE TABLE IF NOT EXISTS game (
    matchId varchar(36) NOT NULL,
    index INTEGER NOT NULL,
    PRIMARY KEY (matchId, index),
    FOREIGN KEY (matchId) references match(id)
);
CREATE TABLE IF NOT EXISTS player (
    id varchar(36) PRIMARY KEY,
    name TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS matchPlayer (
    matchId varchar(36) NOT NULL,
    playerId varchar(36) NOT NULL,
    index INTEGER NOT NULL,
    PRIMARY KEY (matchId, playerId)
);
ALTER TABLE matchPlayer
ADD CONSTRAINT uniqMatchPlayerIndex UNIQUE(matchId, index);
CREATE TABLE IF NOT EXISTS gameScore (
    gameId varchar(36) NOT NULL,
    playerId varchar(36) NOT NULL,
    value INTEGER DEFAULT 0 NOT NULL,
    PRIMARY KEY (gameId, playerId),
    FOREIGN KEY (gameId) references game(id),
    FOREIGN KEY (playerId) references player(id)
);


select contest.id contestId,
    contest.name contestName,
    slate.name slateName,
    slate.id slateId,
    slate.idx slateIdx,
    match.id matchId,
    match.idx matchIdx,
    mPlayer1.playerId player1Id,
    mPlayer2.playerId player2Id,
    player1.name player1Name,
    player2.name player2Name
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
order by slateIdx,
    matchIdx


 