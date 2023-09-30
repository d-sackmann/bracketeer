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
	<thead>
		<tr>
			{#each $slate.matches[0].games as _, i}
				<th class="col-header" scope="col">Game {i + 1}</th>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each $slate.matches as match (match.id)}
			<tr><td class="spacer" colspan={match.games.length + 1} /></tr>

			<tr>
				<td colspan={match.games.length}>
					<span style={`color: ${getColorScheme(playerColors[match.players[0]]).secondaryBg}`}
						>{playersById[match.players[0]]?.name || 'Unknown'}</span
					>
					vs.
					<span style={`color: ${getColorScheme(playerColors[match.players[1]]).secondaryBg}`}
						>{playersById[match.players[1]]?.name || 'Unknown'}</span
					></td
				>
			</tr>
			<tr>
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
				<tr>
					<td class="score-input" colspan={match.games.length}>
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
	</tbody>
</table>

<style>
	.col-header {
		min-width: 78px;
	}
	.open-score,
	.score-input {
		background-color: var(--secondary-accent-color);
		box-sizing: border-box;
	}

	td,
	th {
		outline: 1px solid white;
	}

	table {
		table-layout: fixed;
	}
	.spacer {
		outline: none;
		padding-top: 20px;
	}
</style>
