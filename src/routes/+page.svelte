<script lang="ts">
	import EditablePlayerList from '$lib/EditablePlayerList.svelte';
</script>

<form method="POST" action="/contests">
	<div>
		<label for="contest-name">Name:</label>
		<input name="contestName" id="contest-name" />
	</div>
	<div>
		<label for="num-groups">Number of groups:</label>
		<input type="number" name="numGroups" id="num-groups" />
	</div>

	<fieldset>
		<legend>Series length</legend>

		<div>
			<input type="radio" name="gamesToWin" id="games-to-win-bo3" value="2" />
			<label for="games-to-win">Best of 3</label>
		</div>

		<div>
			<input type="radio" name="gamesToWin" id="games-to-win-bo5" value="3" />
			<label for="games-to-win">Best of 5</label>
		</div>
		<div>
			<input type="radio" name="gamesToWin" id="games-to-win-bo7" value="4" />
			<label for="games-to-win">Best of 7</label>
		</div>
	</fieldset>
	<EditablePlayerList />

	<button type="submit">Go</button>
</form>
