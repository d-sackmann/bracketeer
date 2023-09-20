<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<li>
	{#each data.contests as contest}
		<ul>
			<a href="/contests/{contest.id}">{contest.name}</a>
		</ul>
	{/each}
</li>

<slot />
