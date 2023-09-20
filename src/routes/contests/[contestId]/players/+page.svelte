<script lang="ts">
	import EditablePlayerList from '$lib/EditablePlayerList.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<EditablePlayerList
	groupCount={undefined}
	players={data.players}
	allowRemoval={false}
	allowAddition={false}
/>
