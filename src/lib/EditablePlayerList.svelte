<script lang="ts">
	import Trash from 'iconoir/icons/trash.svg';
	import Plus from 'iconoir/icons/plus.svg';
	import { getGroupNumbers, type GroupMethod, type Player } from './core';

	export let players: Player[] = [];
	export let allowRemoval = true;
	export let allowAddition = true;
	export let groupCount: number | undefined;
	export let groupMethod: GroupMethod = 'alternating';
	let newPlayerName = '';
	function addPlayer() {
		players = [...players, { name: newPlayerName, id: '' }];
		newPlayerName = '';
	}

	function removePlayer(playerIdx: number) {
		players = players.filter((_player, idx) => idx !== playerIdx);
	}

	$: groupNumbers = groupCount ? getGroupNumbers(players.length, groupCount, groupMethod) : null;
</script>

<fieldset>
	<legend>Players</legend>
	<ul>
		{#each players as player, idx}
			<li>
				{#if groupNumbers}
					Group {groupNumbers[idx] + 1}
				{/if}
				<label for={`player-name-${idx}`}>Player {idx + 1} </label>
				<input type="text" value={player.name} name="playerName" id={`player-name-${idx}`} />
				{#if allowRemoval}
					<button on:click|preventDefault={() => removePlayer(idx)}
						><img src={Trash} alt="delete" /></button
					>
				{/if}
			</li>
		{/each}
	</ul>

	{#if allowAddition}
		<form on:submit|preventDefault={addPlayer}>
			<label for="new-player-name">Player Name</label>
			<input type="text" id="new-player-name" bind:value={newPlayerName} />
			<button type="submit"><img src={Plus} alt="add user" /></button>
		</form>
	{/if}
</fieldset>
