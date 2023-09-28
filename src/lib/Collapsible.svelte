<script lang="ts">
	import ArrowUp from 'iconoir/icons/nav-arrow-up.svg';
	import ArrowDown from 'iconoir/icons/nav-arrow-down.svg';

	import { slide } from 'svelte/transition';
	import { getColorScheme, type ColorScheme, type PlayerColor } from './playerColors';

	export let startsOpen: boolean | undefined = undefined;

	export let scheme: ColorScheme | undefined = undefined;
	export let color: PlayerColor = 'grey';

	let open = !!startsOpen;

	$: colorScheme = scheme || getColorScheme(color);
	$: primaryStyle = `background-color: ${colorScheme.primaryBg}`;
	$: secondaryStyle = `background-color: ${colorScheme.secondaryBg}`;
</script>

<div class="collapsible" style={primaryStyle}>
	<button
		class="container header-container no-button-style"
		on:click={() => (open = !open)}
		style={secondaryStyle}
	>
		<slot name="header" />
		{#if open}
			<div transition:slide class="container content-container" style={primaryStyle}>
				<slot name="content" />
			</div>
		{/if}
		<div class="container footer-container" style={secondaryStyle}>
			<img src={open ? ArrowUp : ArrowDown} alt={open ? 'close' : 'open'} />
		</div>
	</button>
</div>

<style>
	.collapsible {
		--border-radius: 6px;
		margin-top: 4px;
		margin-bottom: 4px;
		border-radius: var(--border-radius);
	}
	button {
		width: 100%;
	}

	.container {
		border-radius: var(--border-radius);
	}

	.content-container {
		margin-left: 5px;
		margin-right: 5px;
	}
</style>
