<script lang="ts">
	import Trash from 'iconoir/icons/trash.svg';
	import Plus from 'iconoir/icons/plus.svg';
	import { getGroupNumbers, type GroupMethod, type Player } from './core';
	import TextInput from './TextInput.svelte';

	export let players: Player[] = [];
	export let allowRemoval = true;
	export let allowAddition = true;
	export let groupCount: number;
	export let groupMethod: GroupMethod = 'alternating';
	let newPlayerName = '';
	function addPlayer() {
		players = [...players, { name: newPlayerName, id: '' }];
		newPlayerName = '';
	}

	function removePlayer(playerIdx: number) {
		players = players.filter((_player, idx) => idx !== playerIdx);
	}

	$: groupNumbers = getGroupNumbers(players.length, groupCount, groupMethod);
</script>

<fieldset>
	<legend>Players</legend>
	{#each players as player, idx}
		<TextInput
			id={`player-name-${idx}`}
			name="playerName"
			label={`Name (Group ${groupNumbers[idx] + 1})`}
			value={player.name}
		>
			{#if allowRemoval}
				<button on:click|preventDefault={() => removePlayer(idx)}
					><img src={Trash} alt="delete" /></button
				>
			{/if}
		</TextInput>
	{/each}

	{#if allowAddition}
		<form on:submit|preventDefault={addPlayer}>
			<TextInput id="new-player-name" label="Player Name" bind:value={newPlayerName}>
				<button type="submit"><img src={Plus} alt="add user" /></button>
			</TextInput>
		</form>
	{/if}
</fieldset>

<style>
	fieldset {
		margin: 0;
		padding: 10px;
		width: fit-content;
	}
</style>
