<script lang="ts">
	import { difficulties } from '$lib/puzzle/PuzzleListNames';
</script>

<svelte:head>
	<title>Puzzle</title>
	<meta name="description" content="Puzzle game" />
</svelte:head>

{#each difficulties as difficulty}
	<div>
		<a href="/{difficulty.key}">{difficulty.name}</a>
	</div>
{/each}
