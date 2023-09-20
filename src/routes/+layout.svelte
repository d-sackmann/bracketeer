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
		font-family: 'Courier New', Courier, monospace;
		font-size: 20px;
		background-color: var(--primary-bg-color);
		color: var(--primary-text-color);
	}

	:global(input) {
		font-family: 'Courier New', Courier, monospace;

		font-size: 23px;
		border-radius: 5px;
		background-color: var(--primary-accent-color);
	}

	:global(a) {
		color: var(--primary-text-color);
	}
</style>
