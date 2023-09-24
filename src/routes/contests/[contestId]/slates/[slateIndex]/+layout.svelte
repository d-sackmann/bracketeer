<script lang="ts">
	import { page } from '$app/stores';
	import type { LayoutData } from './$types';
	import MatchDisplay from '$lib/MatchDisplay.svelte';
	import type { Player } from '$lib/core';
	import { keyBy } from '$lib/utils';
	import ResultList from '$lib/ResultList.svelte';

	export let data: LayoutData;

	$: playersById = keyBy(data.players, (p) => p.id as keyof Player);
	$: orderedSlates = data.contest.slates
		.slice(data.slateIndex)
		.concat(data.contest.slates.slice(0, data.slateIndex));

	function getOriginalSlateIndex(slateId: string) {
		return data.contest.slates.findIndex(({ id }) => slateId === id);
	}
</script>

{#each orderedSlates as slate}
	<MatchDisplay
		{slate}
		slateIndex={getOriginalSlateIndex(slate.id)}
		contestId={data.contestId}
		{playersById}
		openScore={{ matchId: $page.data.matchId, gameIdx: $page.data.gameIdx }}><slot /></MatchDisplay
	>
	<ResultList {slate} {playersById} />
{/each}

<style>
	:global(table) {
		border-collapse: collapse;
	}
</style>
