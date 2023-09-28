<script lang="ts">
	import type { Match, Player, Slate } from '$lib/core';
	import type { Writable } from 'svelte/store';
	import Score from './Score.svelte';
	import ScoreInput from './ScoreInput.svelte';
	import { getColorScheme, type PlayerColor } from './playerColors';

	export let slate: Writable<Slate>;
	export let playersById: Record<string, Player>;
	export let playerColors: Record<string, PlayerColor>;

	type GameIdentifier = { matchId: string; gameIndex: number };
	let selectedGame: GameIdentifier | null = null;

	function openScoreInput(gameIdentifier: GameIdentifier) {
		selectedGame = gameIdentifier;
	}

	function closeScoreInput() {
		selectedGame = null;
	}

	function getScores(match: Match, gameIndex: number) {
		return match.players.map((player, idx) => ({
			playerId: player,
			value: match.games[gameIndex].score[idx]
		}));
	}

	function handleScoreSaved(gameIdentifier: GameIdentifier | null, score: number[]) {
		if (!gameIdentifier) return;
		slate.update((oldSlateValue) => {
			console.log(JSON.stringify(oldSlateValue));
			const matchIdx = oldSlateValue.matches.findIndex(({ id }) => id === gameIdentifier.matchId);
			const match = oldSlateValue.matches[matchIdx];
			const game = match?.games[gameIdentifier.gameIndex];
			if (!game) {
				return oldSlateValue;
			}

			const updatedMatch = {
				...match,
				games: match.games
					.slice(0, gameIdentifier.gameIndex)
					.concat([{ score }])
					.concat(match.games.slice(gameIdentifier.gameIndex + 1))
			};

			const newValue = {
				...oldSlateValue,
				matches: oldSlateValue.matches
					.slice(0, matchIdx)
					.concat([updatedMatch])
					.concat(oldSlateValue.matches.slice(matchIdx + 1))
			};

			console.log(JSON.stringify(newValue));

			return newValue;
		});
		closeScoreInput();
	}
</script>

<table>
	<tr>
		<th scope="row">Game</th>
		{#each $slate.matches[0].games as _, i}
			<th scope="col">{i + 1}</th>
		{/each}
	</tr>
	{#each $slate.matches as match (match.id)}
		<tr>
			<th scope="row">
				<span style={`color: ${getColorScheme(playerColors[match.players[0]]).secondaryBg}`}
					>{playersById[match.players[0]]?.name || 'Unknown'}</span
				>
				vs.
				<span style={`color: ${getColorScheme(playerColors[match.players[1]]).secondaryBg}`}
					>{playersById[match.players[1]]?.name || 'Unknown'}</span
				>
			</th>
			{#each match.games as _, i}
				<td
					class={selectedGame?.matchId === match.id && selectedGame?.gameIndex === i
						? 'open-score'
						: ''}
				>
					<button
						class="no-button-style"
						on:click={() => openScoreInput({ matchId: match.id, gameIndex: i })}
					>
						<Score scores={match.games[i].score} />
					</button>
				</td>
			{/each}
		</tr>
		{#if selectedGame?.matchId === match.id}
			<tr class="score-input">
				<td />
				<td colspan={match.games.length}>
					<ScoreInput
						scores={getScores(match, selectedGame.gameIndex)}
						gameIndex={selectedGame.gameIndex}
						matchId={selectedGame.matchId}
						onScoreSaved={(score) => handleScoreSaved(selectedGame, score)}
					/>
				</td>
			</tr>
		{/if}
	{/each}
</table>

<style>
	.open-score,
	.score-input {
		background-color: var(--secondary-accent-color);
	}

	td {
		outline: 1px solid white;
	}
</style>
