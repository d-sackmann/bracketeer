<script lang="ts">
	import { writable, type Writable } from 'svelte/store';
	import { setContext } from 'svelte';
	import EditablePlayerList from '$lib/EditablePlayerList.svelte';
	import MatchDisplay from '$lib/MatchDisplay.svelte';
	import type { Player } from '$lib/core';
	import { PLAYER_CONTEXT } from '$lib/contexts/player-context';

	let playerIds: string[] = [];

	setContext(PLAYER_CONTEXT, writable({} as Record<string, Writable<Player>>));
	const gamesToWin = 3;
	const venue = { name: 'T 1' };
</script>

<EditablePlayerList onPlayerListFinalized={(p) => (playerIds = p.map(({ id }) => id))} />
<MatchDisplay {playerIds} {gamesToWin} {venue} />
