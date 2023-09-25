<script lang="ts">
	export let name: string | undefined = undefined;
	export let label: string;
	export let id: string;
	export let value: string | undefined = undefined;
</script>

<div class="container">
	<label for={id}>{label}</label>
	<div class="container">
		<input {name} {id} type="text" bind:value />
		<slot />
	</div>
</div>

<style>
	.container > * {
		display: flex;
	}
</style>
