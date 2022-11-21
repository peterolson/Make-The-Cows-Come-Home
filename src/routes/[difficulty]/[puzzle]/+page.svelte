<script lang="ts">
	import Puzzle from '$lib/puzzle/Puzzle.svelte';
	import { puzzles } from '$lib/puzzle/PuzzleList';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="column">
	<div class="header">
		<div>
			<a href="/{data.key}">=</a>
			{#if data.prevPuzzle}
				<a href="/{data.key}/{data.prevPuzzle}">←</a>
			{/if}
		</div>
		<h1>{data.title}</h1>
		<div>
			{#if data.nextPuzzle}
				<a href="/{data.key}/{data.nextPuzzle}">#{data.index + 2} →</a>
			{/if}
		</div>
	</div>
	<div class="board">
		{#key data.puzzleString}
			<Puzzle puzzleString={data.puzzleString} />
		{/key}
	</div>
</div>

<style>
	.column {
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow: hidden;
	}
	.header {
		height: 64px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
		background-color: var(--color-theme-1);
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		margin-bottom: 3px;
		box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
		padding: 0 16px;
	}

	.header h1,
	.header a {
		font-size: 22px;
		color: rgba(255, 255, 255, 0.95);
	}

	.board {
		flex: 1;
		display: flex;
		flex-direction: column;
	}
</style>
