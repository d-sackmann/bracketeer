<script lang="ts">
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<form method="POST">
	<button type="submit">Create a user<button /> </button>
</form>

{#if form?.success}
	Created user with id {form.userId}
{/if}
