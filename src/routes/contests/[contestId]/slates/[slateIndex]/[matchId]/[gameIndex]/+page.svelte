<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<form method="POST">
	<fieldset>
		{#each data.scores as score}
			<input type="number" name="scores" value={score.value} />
			<input type="hidden" name="players" value={score.playerId} />
		{/each}
	</fieldset>

	<button type="submit">Submit</button>
</form>
