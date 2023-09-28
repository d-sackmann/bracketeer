<script lang="ts">
	import type { Match, Player } from '$lib/core';
	import Score from './Score.svelte';
	import ScoreInput from './ScoreInput.svelte';
	import { getColorScheme, type PlayerColor } from './playerColors';
	import type { SlateStore } from './slateStore';

	export let slate: SlateStore;
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
		slate.updateScore(gameIdentifier, score);
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
