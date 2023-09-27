<script lang="ts">
	import type { Player, Slate } from '$lib/core';
	import Score from './Score.svelte';
	import type { PlayerColor } from './playerColors';
	import { getGameUrl } from './urlHelpers';

	export let slate: Slate;
	export let playersById: Record<string, Player>;
	export let playerColors: Record<string, PlayerColor>;
	export let contestId: string;
	export let slateIndex: number;
	export let openScore: { matchId: string; gameIdx: number };
</script>

<table>
	<tr>
		<th scope="row">Game</th>
		{#each slate.matches[0].games as _, i}
			<th scope="col">{i + 1}</th>
		{/each}
	</tr>
	{#each slate.matches as match (match.id)}
		<tr>
			<th scope="row">
				<span style={`color: ${playerColors[match.players[0]]}`}
					>{playersById[match.players[0]]?.name || 'Unknown'}</span
				>
				vs.
				<span style={`color: ${playerColors[match.players[1]]}`}
					>{playersById[match.players[1]]?.name || 'Unknown'}</span
				>
			</th>
			{#each match.games as _, i}
				<td class={openScore.matchId === match.id && openScore.gameIdx === i ? 'open-score' : ''}>
					<a href={getGameUrl({ contestId, slateIndex, matchId: match.id, gameIndex: i })}>
						<Score scores={match.games[i].score} />
					</a>
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

	td {
		outline: 1px solid white;
	}
</style>
