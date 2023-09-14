<script lang="ts">
	import type { PageData } from './$types';

	import { writable, type Writable } from 'svelte/store';
	import { setContext } from 'svelte';
	import EditablePlayerList from '$lib/EditablePlayerList.svelte';
	import MatchDisplay from '$lib/MatchDisplay.svelte';
	import type { Player } from '$lib/core';
	import { PLAYER_CONTEXT } from '$lib/contexts/player-context';

	const playerStore = writable({} as Record<string, Writable<Player>>);
	setContext(PLAYER_CONTEXT, playerStore);

	export let data: PageData;

	const playerStoreInitValue = {} as Record<string, Writable<Player>>;

	data.players.forEach((player) => {
		playerStoreInitValue[player.id] = writable(player);
	});
	playerStore.set(playerStoreInitValue);
</script>

<EditablePlayerList players={data.players} />

{#each data.contest.slates as slate}
	<MatchDisplay playerIds={slate.players} gamesToWin={slate.gamesToWin} groupName={slate.name} />
{/each}
