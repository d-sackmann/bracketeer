<script lang="ts">
	import ArrowRight from 'iconoir/icons/arrow-right-circle.svg';
	import RadioGroup from '$lib/RadioGroup.svelte';
	import EditablePlayerList from '$lib/EditablePlayerList.svelte';
	import type { GroupMethod, Player } from '$lib/core';
	import TextInput from '$lib/TextInput.svelte';
	import { enhance } from '$app/forms';

	let groupMethod: GroupMethod = 'alternating';
	let groupCount = 1;
	let players: Player[] = [];

	const seriesLengths = [
		{ label: '2 / 3', value: 2, checked: true },
		{ label: '3 / 5', value: 3 },
		{ label: '4 / 7', value: 4 }
	];
	const groupOptions = [
		{
			label: 'Alternating',
			value: 'alternating',
			checked: true
		},
		{
			label: 'Grouped',
			value: 'grouped'
		},
		{
			label: 'Random',
			value: 'random'
		}
	];

	function getMaxGroups(playerCount: number) {
		const minGroupSize = 2;
		return Math.max(1, Math.floor(playerCount / minGroupSize));
	}
	$: groupNumOptions = Array.from({ length: getMaxGroups(players.length) }).map((_, idx) => ({
		value: idx + 1,
		label: idx + 1
	}));
</script>

<form method="POST" use:enhance action="/contests">
	<EditablePlayerList {groupCount} {groupMethod} bind:players />

	<RadioGroup
		label="Number of groups"
		options={groupNumOptions}
		name="numGroups"
		bind:value={groupCount}
	/>
	<RadioGroup
		label="Grouping method"
		options={groupOptions}
		name="groupMethod"
		bind:value={groupMethod}
	/>
	<RadioGroup label="Series length" options={seriesLengths} name="gamesToWin" value={2} />
	<TextInput required={true} id="contest-name" name="contestName" label="Name">
		<button type="submit"><img src={ArrowRight} alt="Go" /></button>
	</TextInput>
</form>

<style>
</style>
