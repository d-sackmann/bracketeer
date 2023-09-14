<script lang="ts">
	import { generateRoundRobinMatches, type Match } from '$lib/core';
	import PlayerName from './PlayerName.svelte';
	import ResultList from './ResultList.svelte';

	export let playerIds: string[];
	export let gamesToWin: number;
	export let groupName: string;

	let matchBeingEdited: string | null;
	let gameBeingEdited: number | null;

	let matches: Match[] = [];
	$: maxMatches = gamesToWin * 2 - 1;

	$: rebuild(playerIds, gamesToWin);
	$: slate = { matches, name: groupName, gamesToWin };

	function rebuild(playerIds: string[], gamesToWin: number) {
		matches = generateRoundRobinMatches(playerIds, gamesToWin);
	}

	function openScoreEditor(match: Match, gameIdx: number) {
		matchBeingEdited = match.id;
		gameBeingEdited = gameIdx;
	}

	function closeScoreEditor() {
		matchBeingEdited = null;
		gameBeingEdited = null;
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
			<th scope="row">
				<PlayerName playerId={match.players[0]} /> vs. <PlayerName playerId={match.players[1]} />
			</th>
			{#each { length: maxMatches } as _, i}
				<td>
					{#if match.id === matchBeingEdited && i === gameBeingEdited}
						<form on:submit|preventDefault={() => closeScoreEditor()}>
							{#each match.games[i].score as score, gameIdx}
								<input type="number" bind:value={score} id="score-{gameIdx}" />
							{/each}
							<input type="submit" hidden />
						</form>
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

<ResultList {slate} {playerIds} />
