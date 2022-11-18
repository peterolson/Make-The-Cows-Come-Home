<script lang="ts">
	import { puzzles } from '$lib/puzzle/PuzzleList';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>{data.name}</title>
	<meta name="description" content="Puzzle game" />
</svelte:head>

<h1>{data.name}</h1>

{#each data.puzzleList as puzzle, i}
	<div>
		<a href="/{data.key}/{puzzle.board}">{data.prefix}{i + 1}</a>
		{puzzle.board.split('~')[0]} moves
	</div>
{/each}
