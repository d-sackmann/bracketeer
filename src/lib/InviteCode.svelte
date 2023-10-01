<script lang="ts">
	import QRCode from 'qrcode';

	import { onMount } from 'svelte';

	export let url: string;
	let canvas: HTMLCanvasElement;

	onMount(() => {
		QRCode.toCanvas(canvas, url, { errorCorrectionLevel: 'L' });
	});
</script>

<canvas bind:this={canvas} />
