<script lang="ts">
	export let value: string[];

	let newPlayerName = '';

	function addPlayer() {
		value = [...value, newPlayerName];
		newPlayerName = '';
	}

	function removePlayer(playerIdx: number) {
		value = value.filter((_name, idx) => idx !== playerIdx);
	}
</script>

<ul>
	{#each value as player, idx}
		<li>
			<input type="text" value={player} id={`playerName${idx}`} />
			<button on:click|preventDefault={() => removePlayer(idx)}>X</button>
		</li>
	{/each}
</ul>

<form on:submit|preventDefault={addPlayer}>
	<label for="new-player-name">Player Name</label>
	<input type="text" id="new-player-name" bind:value={newPlayerName} />
	<button type="submit">Submit</button>
</form>
