<script lang="ts">
	import { getContestUrl } from '$lib/urlHelpers';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<slot />

<li>
	{#each data.contests as contest}
		<ul>
			<a href={getContestUrl({ contestId: contest.id })}>{contest.name}</a>
		</ul>
	{/each}
</li>
