<script lang="ts">
	export let label: string;
	export let name: string;
	export let options: { label: string | number; value: string | number; checked?: boolean }[];
	export let value: string | number | null = null;

	const idPrefix = `radio-${Math.random().toString(36).substring(2, 7)}-`;
</script>

<fieldset class="radio-group">
	<legend>{label}</legend>

	{#each options as option, i}
		<div class="radio-button">
			<input
				bind:group={value}
				type="radio"
				{name}
				id={idPrefix + i}
				value={option.value}
				checked={option.checked}
			/>
			<label for={idPrefix + i}>{option.label}</label>
		</div>
	{/each}
</fieldset>

<style>
	fieldset {
		border: 0;
	}
	.radio-group {
		display: flex;
	}

	.radio-button {
		outline: 1px solid var(--primary-accent-color);
	}

	.radio-button > label {
		cursor: pointer;
		padding: 12px;
		display: inline-block;
	}

	input[type='radio'] {
		visibility: hidden;
		position: absolute;
	}

	input[type='radio']:checked + label {
		background: var(--secondary-accent-color);
	}
</style>
