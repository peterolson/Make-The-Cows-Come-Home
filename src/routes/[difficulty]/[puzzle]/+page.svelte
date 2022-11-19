<script lang="ts">
	import Puzzle from '$lib/puzzle/Puzzle.svelte';
	import { puzzles } from '$lib/puzzle/PuzzleList';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="column">
	<div class="header">
		<div>
			<a href="/{data.key}">← {data.name}</a>
			{#if data.prevPuzzle}
				<a href="/{data.key}/{data.prevPuzzle}">#{data.index}</a>
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
		height: 80px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 16px;
		box-sizing: border-box;
	}
	.board {
		flex: 1;
		display: flex;
		flex-direction: column;
	}
</style>
