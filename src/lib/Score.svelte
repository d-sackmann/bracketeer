<script lang="ts">
	export let scores: number[];

	export let decided = false;
	let winnerIdx: number | null = null;
	$: {
		winnerIdx = scores[0] - scores[1] > 0 ? 0 : 1;

		if (!decided || scores[0] === scores[1]) {
			winnerIdx = null;
		}
	}
	function getScoreClass(idx: number): string {
		const classes = ['score', 'score-' + idx];
		if (winnerIdx === idx) {
			classes.push('winner');
		}

		return classes.join(' ');
	}
</script>

<span class={getScoreClass(0)}>{scores[0]}</span>-<span class={getScoreClass(1)}>{scores[1]}</span>

<style>
	.winner {
		font-weight: bold;
	}

	span {
		font-family: 'Courier New', Courier, monospace;
	}
</style>
