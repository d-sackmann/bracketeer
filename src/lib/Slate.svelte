<script lang="ts">
	import type { Player } from '$lib/core';
	import type { PlayerColor } from './playerColors';
	import MatchDisplay from '$lib/MatchDisplay.svelte';
	import ResultList from '$lib/ResultList.svelte';
	import eventSource from '$lib/eventSource';
	import type { SlateStore } from './slateStore';
	import { onMount } from 'svelte';

	export let contestId: string;
	export let slateIndex: number;

	export let slate: SlateStore;
	export let playersById: Record<string, Player>;
	export let playerColors: Record<string, PlayerColor>;

	onMount(() => {
		const source = eventSource(`/sse?contestId=${contestId}&slateIndex=${slateIndex}`);

		return slate.linkToEventSource(source);
	});
</script>

<MatchDisplay {slate} {playersById} {playerColors} />
<ResultList {slate} {playersById} {playerColors} />
