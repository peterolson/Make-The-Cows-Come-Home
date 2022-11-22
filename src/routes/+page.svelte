<script lang="ts">
	import { difficulties } from '$lib/puzzle/PuzzleListNames';
	import Header from '$lib/ui/Header.svelte';
</script>

<svelte:head>
	<title>Make the cows come home</title>
	<meta name="description" content="Puzzle game" />
</svelte:head>

<Header>Make the cows come home</Header>
<div class="links">
	{#each difficulties as difficulty}
		<div>
			<a href="/{difficulty.key}">{difficulty.name}</a>
		</div>
	{/each}
</div>

<style>
	.links {
		text-align: center;
	}
</style>
