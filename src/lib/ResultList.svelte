<script lang="ts">
	import {
		type Player,
		type Slate,
		getIndividualResults,
		type MatchResult,
		resultComparator,
		isDecided
	} from '$lib/core';
	import Score from './Score.svelte';
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

<div class="table-container">
	<h4 class="table-title">Match Results</h4>
	<table>
		<tr>
			<th />
			{#each slate.players as opponentId}
				<th scope="col" class="rotate"
					><div><span>{playersById[opponentId]?.name || 'Unknown'}</span></div></th
				>
			{/each}
			<th class="rotate"><div><span>Wins</span></div></th>
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
							<!-- nothing -->
						{:else if !matchResultForOpponent}
							Missing!
						{:else}
							<Score
								scores={[matchResultForOpponent.gamesWon, matchResultForOpponent.gamesLost]}
								decided={isDecided(matchResultForOpponent.outcome)}
							/>
						{/if}
					</td>
				{/each}
				<td>{tally(orderedResult.results, ({ outcome }) => outcome === 'win')}</td>
			</tr>
		{/each}
	</table>
</div>

<style>
	.table-container {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
	}

	.table-title {
		flex-basis: 50px;
	}
	th[scope='row'] {
		overflow: hidden;
		white-space: nowrap;
		max-width: 100px;
	}
</style>
