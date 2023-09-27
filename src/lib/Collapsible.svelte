<script lang="ts">
	import ArrowUp from 'iconoir/icons/nav-arrow-up.svg';
	import ArrowDown from 'iconoir/icons/nav-arrow-down.svg';

	import { slide } from 'svelte/transition';

	type CollapsibleColors = {
		primaryBg: string;
		secondaryBg: string;
	};
	export let startsOpen: boolean | undefined = undefined;

	export let colors: CollapsibleColors | undefined = undefined;
	export let theme: 'red' | 'orange' | 'green' | 'blue' | 'pink' | 'purple' | 'brown' | 'grey' =
		'grey';

	const colorsByTheme: Record<string, CollapsibleColors> = {
		red: {
			secondaryBg: '#cb2424',
			primaryBg: '#fe5757'
		},
		orange: {
			primaryBg: '#fb7200',
			secondaryBg: '#e36700'
		},
		green: {
			primaryBg: '#00b100',
			secondaryBg: '#00cb00'
		},
		blue: {
			primaryBg: '#001eff',
			secondaryBg: '#001be7'
		},
		pink: {
			primaryBg: '#ff33ff',
			secondaryBg: '#ff66ff'
		},
		purple: {
			primaryBg: '#4c0099',
			secondaryBg: '#6600cc'
		},
		brown: {
			primaryBg: '#9f530a',
			secondaryBg: '#9f6210'
		},
		grey: {
			primaryBg: '#969696',
			secondaryBg: '#7b7d7b'
		}
	};
	let open = !!startsOpen;

	$: colorScheme = colors || colorsByTheme[theme] || colorsByTheme.gray;
	$: primaryStyle = `background-color: ${colorScheme.primaryBg}`;
	$: secondaryStyle = `background-color: ${colorScheme.secondaryBg}`;
</script>

<div class="collapsible" style={primaryStyle}>
	<button class="container header-container" on:click={() => (open = !open)} style={secondaryStyle}>
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
		background: none;
		color: inherit;
		border: none;
		padding: 0;
		font: inherit;
		cursor: pointer;
		outline: inherit;
	}

	.container {
		border-radius: var(--border-radius);
	}

	.content-container {
		margin-left: 5px;
		margin-right: 5px;
	}
</style>
