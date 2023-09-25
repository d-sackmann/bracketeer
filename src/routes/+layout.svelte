<script lang="ts">
	import { onNavigate } from '$app/navigation';

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
</script>

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
		font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
		font-size: 20px;
		background-color: var(--primary-bg-color);
		color: var(--primary-text-color);
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
		text-align: left;
	}

	:global(table) {
		border-collapse: collapse;
		--table-border-width: 1px;
	}
	:global(td) {
		text-align: center;
		outline: 1px solid var(--primary-text-color);

		padding: 10px 5px;
	}

	:global(th.rotate) {
		white-space: nowrap;
		position: relative;
	}

	:global(th.rotate > div) {
		position: absolute;
		bottom: 0;
		left: 0;
		text-align: left;
		transform: translate(calc(100% - var(--table-border-width) / 2), var(--table-border-width))
			rotate(315deg);
		transform-origin: 0% calc(100% - var(--table-border-width));
		width: 100%;
	}
	:global(th.rotate > div > span) {
		position: absolute;
		bottom: 0;
		left: 0;
		border-bottom: var(--table-border-width) solid gray;
		max-width: 130px;
		overflow: hidden;
	}

	:global(td) {
		border-right: var(--table-border-width) solid gray;
		min-width: 30px;
		padding-top: 2px;
		padding-left: 5px;
		text-align: right;
	}
</style>
