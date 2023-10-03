<script lang="ts">
	import Menu from 'iconoir/icons/menu.svg';
	import { afterNavigate, onNavigate } from '$app/navigation';
	import { slide } from 'svelte/transition';

	let menuOpen = false;
	onNavigate((navigation) => {
		const document = window.document as typeof window.document & {
			startViewTransition: (cb: () => unknown) => unknown;
		};
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	afterNavigate(() => {
		menuOpen = false;
	});
</script>

<div class="app-header">
	<button on:click={() => (menuOpen = !menuOpen)}><img src={Menu} alt="Menu" /></button>
</div>

{#if menuOpen}
	<nav in:slide>
		<a href="/">Create new Contest</a>
		<a href="/contests">Contest History</a>
	</nav>
{/if}
<slot />

<style>
	:global(:root) {
		--primary-bg-color: #2b303a;
		--secondary-bg-color: #7c7c7c;
		--primary-text-color: #eee5e9;
		--primary-accent-color: #92dce5;
		--secondary-accent-color: #d64933;
	}
	:global(body) {
		font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
			Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
		font-size: 20px;
		background-color: var(--primary-bg-color);
		color: var(--primary-text-color);
		margin: 0;
	}

	:global(table) {
		border-collapse: collapse;
	}

	:global(input) {
		font-family: 'Courier New', Courier, monospace;

		font-size: 23px;
		border: none;
		border: 1px solid;
		color: var(--primary-text-color);
		background-color: var(--secondary-bg-color);
		font-family: 'Courier New', Courier, monospace;
		outline: none;
	}

	:global(a) {
		color: var(--primary-text-color);
	}

	:global(button) {
		background-color: var(--primary-accent-color);
	}
	:global(th) {
		font-weight: normal;
	}

	:global(th[scope='row']) {
		font-weight: normal;
		text-align: left;
	}
	:global(button.no-button-style) {
		background: none;
		color: inherit;
		border: none;
		padding: 0;
		font: inherit;
		cursor: pointer;
		outline: inherit;
		width: 100%;
	}

	.app-header {
		width: 100%;
		display: flex;
		justify-content: end;
		background-color: var(--secondary-accent-color);
	}

	nav {
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: var(--secondary-accent-color);
	}

	nav > a {
		margin-top: 3px;
		margin-bottom: 3px;
	}
</style>
