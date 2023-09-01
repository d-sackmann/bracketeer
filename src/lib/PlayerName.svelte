<script lang="ts">
	import { getContext } from 'svelte';

	import { type PlayerContext, PLAYER_CONTEXT } from '$lib/contexts/player-context';
	import { type Readable, derived } from 'svelte/store';

	const playerStore = getContext<PlayerContext>(PLAYER_CONTEXT);

	export let playerId: string;

	let playerName: Readable<string>;

	$: {
		playerName = derived($playerStore[playerId], (player) => {
			return player.name;
		});
	}
</script>

{$playerName}
