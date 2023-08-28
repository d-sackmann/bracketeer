<script lang="ts">
	import EditablePlayerList from '$lib/EditablePlayerList.svelte';
	import MatchDisplay from '$lib/MatchDisplay.svelte';
	import { generateRoundRobinMatches, type Player } from '$lib/core';

	let players: Player[] = [];
</script>

<EditablePlayerList bind:players />
{#if players.length > 1}
	<MatchDisplay matches={generateRoundRobinMatches(players, 3)} />
{/if}
