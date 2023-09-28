<script lang="ts">
	import MatchDisplay from '$lib/MatchDisplay.svelte';
	import type { Player } from '$lib/core';
	import { keyBy } from '$lib/utils';
	import ResultList from '$lib/ResultList.svelte';
	import { getSlateUrl } from '$lib/urlHelpers';
	import { ALL_COLORS } from '$lib/playerColors';
	import eventSource from '$lib/eventSource';
	import slateStore from '$lib/slateStore';
	import type { PageData } from './$types';

	export let data: PageData;

	$: playersById = keyBy(data.players, (p) => p.id as keyof Player);
	$: slate = slateStore(data.slate);
	$: playerColors = $slate.players.reduce(
		(acc, playerId, i) => ({ ...acc, [playerId]: ALL_COLORS[i % ALL_COLORS.length] }),
		{}
	);

	$: {
		eventSource(`/sse?contestId=${data.contestId}&slateIndex=${data.slateIndex}`).subscribe(
			(data) => {
				let scoreChange;

				try {
					scoreChange = JSON.parse(data) as {
						matchId: string;
						gameIndex: number;
						scores: number[];
					};
				} catch (_e) {
					return;
				}

				slate.updateScore(scoreChange, scoreChange.scores);
			}
		);
	}
</script>

<nav>
	{#each data.contest.slates as slate, i}
		<span>
			<a href={getSlateUrl({ contestId: data.contestId, slateIndex: i })}>{slate.name}</a>
		</span>
	{/each}
</nav>

<MatchDisplay {slate} {playersById} {playerColors} />
<ResultList {slate} {playersById} {playerColors} />

<style>
	:global(table) {
		border-collapse: collapse;
	}
</style>
