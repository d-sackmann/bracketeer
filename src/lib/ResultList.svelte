<script lang="ts">
	import {
		type Player,
		type Slate,
		getIndividualResults,
		type MatchResult,
		resultComparator
	} from '$lib/core';
	import { type Readable, derived } from 'svelte/store';
	import { getContext } from 'svelte';
	import { PLAYER_CONTEXT, type PlayerContext } from './contexts/player-context';
	import PlayerName from './PlayerName.svelte';

	export let slate: Slate;
	export let playerIds: string[];

	let orderedResults: { player: Player; results: MatchResult[] }[];
	const playerStore = getContext<PlayerContext>(PLAYER_CONTEXT);

	let playerList: Readable<Player[]>;
	$: {
		playerList = derived(
			playerIds.map((id) => $playerStore[id]),
			(x) => x
		);
	}

	$: {
		orderedResults = $playerList
			.map((player) => {
				return {
					results: getIndividualResults(player.id, slate),
					player: player
				};
			})
			.sort((a, b) => {
				const { value } = resultComparator(a.results, b.results);
				return value;
			});
	}
</script>

<table>
	<tr>
		<th>VS</th>
		{#each playerIds as opponentId}
			<th scope="col"><PlayerName playerId={opponentId} /></th>
		{/each}
	</tr>
	{#each orderedResults as orderedResult (orderedResult.player.id)}
		<tr>
			<th scope="row">{orderedResult.player.name}</th>
			{#each playerIds as opponentId}
				{@const matchResultForOpponent = orderedResult.results.find((r) =>
					r.opponents.includes(opponentId)
				)}
				<td>
					{#if opponentId === orderedResult.player.id}
						n/a
					{:else if !matchResultForOpponent}
						Missing!
					{:else}
						{matchResultForOpponent.gamesWon} - {matchResultForOpponent.gamesLost}
					{/if}
				</td>
			{/each}
		</tr>
	{/each}
</table>
