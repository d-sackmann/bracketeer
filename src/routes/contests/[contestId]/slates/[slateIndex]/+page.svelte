<script lang="ts">
	import type { PageData } from './$types';
	import MatchDisplay from '$lib/MatchDisplay.svelte';
	import type { Player } from '$lib/core';
	import { keyBy } from '$lib/utils';
	import ResultList from '$lib/ResultList.svelte';
	import { getSlateUrl } from '$lib/urlHelpers';
	import { ALL_COLORS } from '$lib/playerColors';
	import { writable } from 'svelte/store';

	export let data: PageData;

	$: playersById = keyBy(data.players, (p) => p.id as keyof Player);
	$: slate = writable(data.contest.slates[data.slateIndex]);
	$: playerColors = $slate.players.reduce(
		(acc, playerId, i) => ({ ...acc, [playerId]: ALL_COLORS[i % ALL_COLORS.length] }),
		{}
	);
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
