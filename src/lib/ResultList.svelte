<script lang="ts">
	import {
		type Player,
		type Slate,
		getIndividualResults,
		type MatchResult,
		resultComparator
	} from '$lib/core';
	import { tally } from './utils';
	export let slate: Slate;
	export let playersById: Record<string, Player>;

	let orderedResults: { player: Player; results: MatchResult[] }[];

	$: playerList = slate.players.map((id) => playersById[id]).filter((x) => x);

	$: {
		orderedResults = playerList
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
		{#each slate.players as opponentId}
			<th scope="col">{playersById[opponentId]?.name || 'Unknown'}</th>
		{/each}
		<th>Wins</th>
	</tr>
	{#each orderedResults as orderedResult (orderedResult.player.id)}
		<tr>
			<th scope="row">{orderedResult.player.name}</th>
			{#each slate.players as opponentId}
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
			<td>{tally(orderedResult.results, ({ outcome }) => outcome === 'win')}</td>
		</tr>
	{/each}
</table>
