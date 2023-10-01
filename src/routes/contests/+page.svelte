<script lang="ts">
	import { getContestUrl } from '$lib/urlHelpers';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<slot />

<ul>
	{#each data.contests as contest}
		<li>
			<a href={getContestUrl({ contestId: contest.id })}>{contest.name}</a>
		</li>
	{/each}
</ul>
