<script lang="ts">
	import RightRoundArrow from 'iconoir/icons/right-round-arrow.svg';
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { getSlateUrl } from '$lib/urlHelpers';

	export let data: PageData;
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

	page.subscribe((p) => {
		if (p.form?.success) {
			goto(getSlateUrl({ contestId: data.contestId, slateIndex: data.slateIndex }));
		}
	});
</script>

<form method="POST" use:enhance>
	{#each data.scores as score, i}
		<input
			bind:this={inputs[i]}
			use:autoFocusFirst={i}
			on:focus={async () => {
				await onFocus(i);
			}}
			type="number"
			name="scores"
			value={score.value}
		/>
		<input type="hidden" name="players" value={score.playerId} />
	{/each}

	<button type="submit"><img src={RightRoundArrow} alt="Submit" /></button>
</form>

<style>
	form {
		border: none;
		display: inline-flex;
	}
	input {
		display: inline;
		width: 27px;
	}

	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		/* display: none; <- Crashes Chrome on hover */
		-webkit-appearance: none;
		margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
	}

	input[type='number'] {
		-moz-appearance: textfield; /* Firefox */
	}

	button {
		display: inline;
	}
</style>
