<script lang="ts">
	export let scores: number[];

	export let highlightedIdx: number | null = null;
	function getScoreClass(idx: number): string {
		const classes = ['score', 'score-' + idx];
		if (highlightedIdx === idx) {
			classes.push('highlighted');
		}

		return classes.join(' ');
	}
</script>

<span class={getScoreClass(0)}>{scores[0]}</span>-<span class={getScoreClass(1)}>{scores[1]}</span>

<style>
	.highlighted {
		font-weight: bold;
	}

	span {
		font-family: 'Courier New', Courier, monospace;
	}
</style>
