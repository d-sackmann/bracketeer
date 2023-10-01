<script lang="ts">
	import Slate from '$lib/Slate.svelte';

	import type { Player } from '$lib/core';
	import { keyBy } from '$lib/utils';
	import { getSlateUrl } from '$lib/urlHelpers';
	import { ALL_COLORS } from '$lib/playerColors';
	import slateStore from '$lib/slateStore';
	import type { PageData } from './$types';

	export let data: PageData;

	$: playersById = keyBy(data.players, (p) => p.id as keyof Player);
	$: slate = slateStore(data.slate);
	$: playerColors = $slate.players.reduce(
		(acc, playerId, i) => ({ ...acc, [playerId]: ALL_COLORS[i % ALL_COLORS.length] }),
		{}
	);
</script>

<nav>
	{#each data.contest.slates as slate, i}
		<a
			class={i === data.slateIndex ? 'active' : ''}
			href={getSlateUrl({ contestId: data.contestId, slateIndex: i })}>{slate.name}</a
		>
	{/each}
</nav>

{#key data.contestId + data.slateIndex}
	<Slate
		contestId={data.contestId}
		slateIndex={data.slateIndex}
		{slate}
		{playerColors}
		{playersById}
	/>
{/key}

<style>
	nav {
		background-color: var(--secondary-accent-color);
		margin-bottom: 7px;
	}

	nav > a {
		display: inline-block;
		margin-right: 10px;
		padding: 7px;
	}

	nav > a.active {
		background-color: var(--primary-bg-color);
	}
</style>
