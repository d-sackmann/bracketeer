<script lang="ts">
	import type { Match } from './core';

	export let matches: Match[];

	let matchBeingEdited: string;
	let gameBeingEdited: number;
	$: maxMatches = matches[0]?.gamesToWin * 2 - 1;

	function openScoreEditor(match: Match, gameIdx: number) {
		matchBeingEdited = match.id;
		gameBeingEdited = gameIdx;
	}
</script>

<table>
	<tr>
		<th>Match</th>
		{#each { length: maxMatches } as _, i}
			<th scope="col">Round {i + 1}</th>
		{/each}
	</tr>
	{#each matches as match (match.id)}
		<tr>
			<th scope="row">{match.displayName}</th>
			{#each { length: maxMatches } as _, i}
				<td>
					{#if match.id === matchBeingEdited && i === gameBeingEdited}
						{#each match.games[i].score as score, gameIdx}
							<input type="number" bind:value={score} id="score-{gameIdx}" />
						{/each}
					{:else}
						<button type="button" on:click={() => openScoreEditor(match, i)}
							>{match.games[i].score[0]} - {match.games[i].score[1]}</button
						>
					{/if}
				</td>
			{/each}
		</tr>
	{/each}
</table>
