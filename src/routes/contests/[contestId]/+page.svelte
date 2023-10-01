<script lang="ts">
	import ResultList from '$lib/ResultList.svelte';
	import type { Player } from '$lib/core';
	import { ALL_COLORS } from '$lib/playerColors';
	import slateStore from '$lib/slateStore';
	import { getContestUrl, getSlateUrl } from '$lib/urlHelpers';
	import { keyBy } from '$lib/utils';
	import type { PageData } from './$types';
	import { PUBLIC_BASE_URL } from '$env/static/public';
	import InviteCode from '$lib/InviteCode.svelte';

	export let data: PageData;

	$: playersById = keyBy(data.players, (p) => p.id as keyof Player);
	$: slates = data.fullContest.slates.map((s) => slateStore(s));

	$: playerColors = data.fullContest.slates.map((slate) => {
		return slate.players.reduce(
			(acc, playerId, i) => ({ ...acc, [playerId]: ALL_COLORS[i % ALL_COLORS.length] }),
			{}
		);
	});

	$: inviteCodeUrl = `${PUBLIC_BASE_URL}${getContestUrl({ contestId: data.contestId })}`;
</script>

{#each data.fullContest.slates as slate, i}
	<a href={getSlateUrl({ contestId: data.contestId, slateIndex: i })}><h2>{slate.name}</h2></a>
	<ResultList slate={slates[i]} playerColors={playerColors[i]} {playersById} />
{/each}

<InviteCode url={inviteCodeUrl} />
