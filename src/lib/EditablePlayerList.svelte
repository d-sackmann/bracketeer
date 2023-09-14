<script lang="ts">
	import { generatePlayer, type Player } from '$lib/core';
	import { getContext } from 'svelte';
	import { PLAYER_CONTEXT, type PlayerContext } from './contexts/player-context';
	import { writable } from 'svelte/store';

	export let onPlayerListFinalized: (p: Player[]) => void = () => {
		throw new Error('Unspecified callback');
	};

	const playerStore = <PlayerContext>getContext(PLAYER_CONTEXT);

	export let players: Player[] = [];

	let newPlayerName = '';
	let allowListChanges = true;
	function removePlayer(playerId: string) {
		players = players.filter(({ id }) => id !== playerId);
	}

	function addPlayer() {
		const newPlayer = generatePlayer(newPlayerName);
		players = players.concat([newPlayer]);
		playerStore.update((state) => ({ ...state, [newPlayer.id]: writable(newPlayer) }));
		newPlayerName = '';
	}

	function finalize() {
		allowListChanges = false;
		onPlayerListFinalized(players);
	}
</script>

<ul>
	{#each players as player (player.id)}
		<li>
			<input
				type="text"
				value={player.name}
				on:keyup={(event) =>
					$playerStore[player.id].update((s) => ({ ...s, name: event.currentTarget.value }))}
			/>
			{#if allowListChanges}
				<button on:click={() => removePlayer(player.id)}>X</button>
			{/if}
		</li>
	{/each}
</ul>

{#if allowListChanges}
	<form on:submit|preventDefault={addPlayer}>
		<label for="new-player-name">Player Name</label>
		<input type="text" id="new-player-name" bind:value={newPlayerName} />
		<button type="submit">Submit</button>
	</form>
{/if}

{#if allowListChanges}
	<button type="button" on:click={() => finalize()}>Finalize</button>
{:else}
	<button type="button" on:click={() => (allowListChanges = true)}>Re-open</button>
{/if}
