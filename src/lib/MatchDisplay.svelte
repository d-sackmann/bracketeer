<script lang="ts">
	import type { Player, Slate } from '$lib/core';
	import ResultList from './ResultList.svelte';

	export let slate: Slate;
	export let playersById: Record<string, Player>;
	export let contestId: string;
	export let slateIndex: number;
</script>

<table>
	<tr>
		<th>Match</th>
		{#each slate.matches[0].games as _, i}
			<th scope="col">Game {i + 1}</th>
		{/each}
	</tr>
	{#each slate.matches as match (match.id)}
		<tr>
			<th scope="row">
				{playersById[match.players[0]]?.name || 'Unknown'} vs. {playersById[match.players[1]]
					?.name || 'Unknown'}
			</th>
			{#each match.games as _, i}
				<td>
					<a href={`/contests/${contestId}/slates/${slateIndex}/${match.id}/${i}`}
						>{match.games[i].score[0]} - {match.games[i].score[1]}</a
					>
				</td>
			{/each}
		</tr>
	{/each}
</table>

<ResultList {slate} {playersById} />
