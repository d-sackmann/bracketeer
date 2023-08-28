<script lang="ts">
	import { generatePlayer, type Player } from './core';

	export let players: Player[];
	let newPlayerName = '';
	function removePlayer(playerId: string) {
		players = players.filter(({ id }) => id !== playerId);
	}

	function handleSubmit() {
		players = players.concat([generatePlayer(newPlayerName)]);
		newPlayerName = '';
	}
</script>

<ul>
	{#each players as player (player.id)}
		<li>
			<span>{player.name}</span><button on:click={() => removePlayer(player.id)}>X</button>
		</li>
	{/each}
</ul>

<form on:submit|preventDefault={handleSubmit}>
	<label for="new-player-name">Player Name</label>
	<input type="text" id="new-player-name" bind:value={newPlayerName} />
	<button type="submit">Submit</button>
</form>
