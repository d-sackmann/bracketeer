<script lang="ts">
	import type { Player } from './core';

	export let players: Player[] = [];
	export let allowRemoval = true;
	export let allowAddition = true;
	let newPlayerName = '';
	function addPlayer() {
		players = [...players, { name: newPlayerName, id: '' }];
		newPlayerName = '';
	}

	function removePlayer(playerIdx: number) {
		players = players.filter((_player, idx) => idx !== playerIdx);
	}
</script>

<fieldset>
	<legend>Players</legend>
	<ul>
		{#each players as player, idx}
			<li>
				<label for={`player-name-${idx}`}>Player {idx + 1}</label>
				<input type="text" value={player.name} name="playerName" id={`player-name-${idx}`} />
				{#if allowRemoval}
					<button on:click|preventDefault={() => removePlayer(idx)}>X</button>
				{/if}
			</li>
		{/each}
	</ul>

	{#if allowAddition}
		<form on:submit|preventDefault={addPlayer}>
			<label for="new-player-name">Player Name</label>
			<input type="text" id="new-player-name" bind:value={newPlayerName} />
			<button type="submit">Add</button>
		</form>
	{/if}
</fieldset>
