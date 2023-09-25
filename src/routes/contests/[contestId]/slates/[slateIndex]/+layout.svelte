<script lang="ts">
	import { page } from '$app/stores';
	import type { LayoutData } from './$types';
	import MatchDisplay from '$lib/MatchDisplay.svelte';
	import type { Player } from '$lib/core';
	import { keyBy } from '$lib/utils';
	import ResultList from '$lib/ResultList.svelte';
	import { getSlateUrl } from '$lib/urlHelpers';

	export let data: LayoutData;

	$: playersById = keyBy(data.players, (p) => p.id as keyof Player);
	$: slate = data.contest.slates[data.slateIndex];
</script>

<nav>
	{#each data.contest.slates as slate, i}
		<span><a href={getSlateUrl({ contestId: data.contestId, slateIndex: i })}>{slate.name}</a></span
		>
	{/each}
</nav>

<MatchDisplay
	{slate}
	slateIndex={data.slateIndex}
	contestId={data.contestId}
	{playersById}
	openScore={{ matchId: $page.data.matchId, gameIdx: $page.data.gameIdx }}
>
	<slot />
</MatchDisplay>
<ResultList {slate} {playersById} />

<style>
	:global(table) {
		border-collapse: collapse;
	}
</style>
