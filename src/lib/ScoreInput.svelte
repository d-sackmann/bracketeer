<script lang="ts">
	import RightRoundArrow from 'iconoir/icons/right-round-arrow.svg';
	import { enhance } from '$app/forms';

	type Score = { value: number; playerId: string };
	export let scores: Score[];
	export let matchId: string;
	export let gameIndex: number;

	export let onScoreSaved: (scores: number[]) => void;
	let inputs: HTMLInputElement[] = [];

	// Auto-select the contents of the input. Typically, the user is setting the score to a new value,
	// so selecting saves them the backspacing. Function is only async to work around some browser weirdness.
	async function onFocus(scoreIdx: number) {
		inputs[scoreIdx].select();
	}

	function autoFocusFirst(el: HTMLInputElement, idx: number) {
		if (idx === 0) {
			el.focus();
			el.select();
		}
	}
</script>

<form
	method="POST"
	use:enhance={() => {
		return () => {
			onScoreSaved(scores.map((s) => s.value));
		};
	}}
>
	{#each scores as score, i}
		<input
			bind:this={inputs[i]}
			use:autoFocusFirst={i}
			on:focus={async () => {
				await onFocus(i);
			}}
			type="number"
			name="scores"
			bind:value={score.value}
		/>
		<input type="hidden" name="players" value={score.playerId} />

		{#if i < scores.length - 1}
			<span> - </span>
		{/if}
	{/each}

	<input type="hidden" value={matchId} name="matchId" />
	<input type="hidden" value={gameIndex} name="gameIndex" />
	<button type="submit"><img src={RightRoundArrow} alt="Submit" /></button>
</form>

<style>
	form {
		border: none;
		display: inline-flex;
		font-size: xx-large;
	}
	input {
		display: inline;
		width: 37px;
		font-size: xx-large;
	}

	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	input[type='number'] {
		-moz-appearance: textfield; /* Firefox */
		appearance: textfield;
	}

	button {
		display: inline;
		margin-left: 12px;
	}
</style>
