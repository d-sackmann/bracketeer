<script lang="ts">
	import type { Match, Player } from './core';
	import { keyBy } from './utils';

	export let matches: Match[];
	export let players: Player[];
	export let gamesToWin: number;

	let matchBeingEdited: string;
	let gameBeingEdited: number;
	$: maxMatches = gamesToWin * 2 - 1;
	$: playersById = keyBy(players, 'id');

	function openScoreEditor(match: Match, gameIdx: number) {
		matchBeingEdited = match.id;
		gameBeingEdited = gameIdx;
	}

	function getMatchDisplayName(match: Match) {
		return match.players.map((playerId) => playersById.get(playerId)?.name).join(' vs. ');
	}
</script>

<table>
	<tr>
		<th>Match</th>
		{#each { length: maxMatches } as _, i}
			<th scope="col">Game {i + 1}</th>
		{/each}
	</tr>
	{#each matches as match (match.id)}
		<tr>
			<th scope="row">{getMatchDisplayName(match)}</th>
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
