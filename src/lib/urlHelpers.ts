type ContestUrlParams = { contestId: string };
export function getContestUrl({ contestId }: ContestUrlParams) {
	return `/contests/${contestId}`;
}

type SlateURLParams = ContestUrlParams & { slateIndex: string | number };
export function getSlateUrl({ contestId, slateIndex }: SlateURLParams) {
	return `${getContestUrl({ contestId })}/slates/${slateIndex}`;
}

type MatchURLParams = SlateURLParams & { matchId: string; gameIndex: string | number };
export function getGameUrl({ contestId, slateIndex, matchId, gameIndex }: MatchURLParams) {
	return `${getSlateUrl({ contestId, slateIndex })}/${matchId}/${gameIndex}`;
}
