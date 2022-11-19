<script lang="ts">
	import { difficulties } from '$lib/puzzle/PuzzleListNames';
</script>

<svelte:head>
	<title>Make the cows come home</title>
	<meta name="description" content="Puzzle game" />
</svelte:head>

<h1>Make the cows come home</h1>
{#each difficulties as difficulty}
	<div>
		<a href="/{difficulty.key}">{difficulty.name}</a>
	</div>
{/each}
