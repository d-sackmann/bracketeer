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

<div class="table-container">
	<h4 class="table-title">Game Results</h4>
	<table>
		<tr>
			<th />
			{#each slate.matches[0].games as _, i}
				<th scope="col" class="rotate"><div><span>Game {i + 1}</span></div></th>
			{/each}
		</tr>
		{#each slate.matches as match (match.id)}
			<tr>
				<th scope="row">
					<div>{playersById[match.players[0]]?.name || 'Unknown'}</div>
					<div>vs.</div>
					<div>{playersById[match.players[1]]?.name || 'Unknown'}</div>
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
</div>

<style>
	.open-score,
	.score-input {
		background-color: var(--primary-accent-color);
	}

	td {
		outline: 1px solid white;
	}

	.table-container {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
	}

	.table-title {
		flex-basis: 80px;
	}

	th[scope='row'] {
		overflow: hidden;
		white-space: nowrap;
		max-width: 100px;
	}
</style>
