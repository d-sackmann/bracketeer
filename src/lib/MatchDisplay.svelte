<script lang="ts">
	import { determineGameOutcome, isDecided, type Player, type Slate } from '$lib/core';
	import Score from './Score.svelte';
	import { getGameUrl } from './urlHelpers';

	export let slate: Slate;
	export let playersById: Record<string, Player>;
	export let contestId: string;
	export let slateIndex: number;
	export let openScore: { matchId: string; gameIdx: number };
</script>

<table>
	<tr>
		<th>Match</th>
		{#each slate.matches[0].games as _, i}
			<th scope="col">Game {i + 1}</th>
		{/each}
	</tr>
	{#each slate.matches as match (match.id)}
		<tr>
			<th scope="row">
				{playersById[match.players[0]]?.name || 'Unknown'} vs. {playersById[match.players[1]]
					?.name || 'Unknown'}
			</th>
			{#each match.games as _, i}
				<td class={openScore.matchId === match.id && openScore.gameIdx === i ? 'open-score' : ''}>
					<a href={getGameUrl({ contestId, slateIndex, matchId: match.id, gameIndex: i })}
						><Score
							scores={match.games[i].score}
							decided={isDecided(
								determineGameOutcome(match.games[i].score[0], match.games[i].score[1])
							)}
						/></a
					>
				</td>
			{/each}
		</tr>
		{#if openScore.matchId === match.id}
			<tr class="score-input">
				<td />
				<td colspan={match.games.length}><slot /></td>
			</tr>
		{/if}
	{/each}
</table>

<style>
	.open-score,
	.score-input {
		background-color: var(--primary-accent-color);
	}
</style>
