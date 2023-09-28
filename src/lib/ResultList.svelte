<script lang="ts">
	import {
		type Player,
		type Slate,
		getIndividualResults,
		type MatchResult,
		resultComparator,
		type MatchResultsComparison
	} from '$lib/core';
	import type { Readable } from 'svelte/store';

	import Collapsible from './Collapsible.svelte';
	import Score from './Score.svelte';
	import type { PlayerColor } from './playerColors';
	import { tally } from './utils';
	import { flip } from 'svelte/animate';
	export let slate: Readable<Slate>;
	export let playersById: Record<string, Player>;
	export let playerColors: Record<string, PlayerColor>;

	let resultsByPlayer: { player: Player; results: MatchResult[] }[];
	let comparisons: Record<string, Record<string, MatchResultsComparison>> = {};

	$: playerList = $slate.players.map((id) => playersById[id]).filter((x) => x);

	$: {
		resultsByPlayer = playerList.map((player) => {
			const results = getIndividualResults(player.id, $slate);
			return {
				results,
				player: player
			};
		});

		resultsByPlayer.forEach(({ player: currentPlayer, results: currentResults }) => {
			const comparisonsForPlayer = comparisons[currentPlayer.id] || {};
			resultsByPlayer.forEach(({ player: comparisonPlayer, results: comparisonResults }) => {
				if (currentPlayer.id !== comparisonPlayer.id) {
					comparisonsForPlayer[comparisonPlayer.id] = resultComparator(
						currentResults,
						comparisonResults
					);
				}
			});
			comparisons[currentPlayer.id] = comparisonsForPlayer;
		});

		resultsByPlayer.sort((a, b) => {
			return comparisons[a.player.id][b.player.id].value;
		});
	}

	function calulateRank(playerId: string): number {
		const otherPlayers = playerList.filter(({ id }) => id !== playerId);
		return (
			tally(
				otherPlayers.map(({ id }) => comparisons[playerId][id].value),
				(v) => v > 0
			) + 1
		);
	}
</script>

{#each resultsByPlayer as playerResult (playerResult.player.id)}
	<div animate:flip>
		<Collapsible color={playerColors[playerResult.player.id]}>
			<div slot="header" class="result-header">
				<span class="player-name">{playerResult.player.name}</span>
				<span class="win-total"
					>Match Wins: {tally(playerResult.results, ({ outcome }) => outcome === 'win')}</span
				>
				<span class="rank">Rank: {calulateRank(playerResult.player.id)}</span>
			</div>
			<div slot="content" class="player-results-container">
				<div class="comparisons-container">
					{#each playerResult.results as resultVsOpponent (resultVsOpponent.matchId)}
						{@const opponent = playersById[resultVsOpponent.opponents[0]]}
						<div>
							Result vs: {opponent.name}:
							<Score
								scores={[resultVsOpponent.gamesWon, resultVsOpponent.gamesLost]}
								highlightedIdx={0}
							/>
						</div>
					{/each}
				</div>

				<div class="comparisons-container">
					<ul class="explanation list">
						{#each playerResult.results as resultVsOpponent (resultVsOpponent.matchId)}
							{@const opponent = playersById[resultVsOpponent.opponents[0]]}
							{@const comparison = comparisons[playerResult.player.id][opponent.id]}
							{@const isWin = comparison.value < 0}
							{#if comparison.rule !== 'matches'}
								<li class="tie-explanation">
									{#if comparison.rule === 'default'}
										Currently tied with {opponent.name}
									{:else if comparison.rule === 'head2head'}
										Tie with {opponent.name} resolved by taking the winner of the head to head match
										up.
										{playerResult.player.name}
										{isWin ? 'won' : 'lost'} their match against {opponent.name}
									{:else if comparison.rule === 'points'}
										Tie with {opponent.name} resolved by point differential. {opponent.name} had a the
										{isWin ? 'lower' : 'higher'} differential by {Math.abs(comparison.value)}
									{:else if comparison.rule === 'games'}
										Tie with {opponent.name} resolved by comparing number of games lost. {opponent.name}
										lost
										{Math.abs(comparison.value)}
										{isWin ? 'more' : 'fewer'}
										{Math.abs(comparison.value) === 1 ? 'game' : 'games'} than {playerResult.player
											.name}
									{/if}
								</li>
							{/if}
						{/each}
					</ul>
				</div>
			</div>
		</Collapsible>
	</div>
{/each}

<style>
	.result-header {
		display: flex;
		padding: 5px;
	}

	.win-total {
		margin-left: auto;
	}
	.rank {
		margin-left: 5px;
	}
	.player-results-container {
		text-align: left;
	}

	.comparisons-container {
		padding: 5px;
	}
</style>
