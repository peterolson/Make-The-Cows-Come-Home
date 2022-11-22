<script lang="ts">
	import { puzzles } from '$lib/puzzle/PuzzleList';
	import { difficulties } from '$lib/puzzle/PuzzleListNames';
	import Header from '$lib/ui/Header.svelte';

	function getSolvedCount(difficulty: string) {
		const filteredPuzzles = puzzles.filter((p) => p.difficulty === difficulty);
		const total = filteredPuzzles.length;
		const solved = filteredPuzzles.filter((p) => {
			if (typeof localStorage === 'undefined') return false;
			return !!localStorage.getItem(p.board);
		}).length;
		const first = filteredPuzzles[0];
		return { total, solved, first };
	}
</script>

<svelte:head>
	<title>Make the cows come home</title>
	<meta name="description" content="Puzzle game" />
</svelte:head>

<Header>Make the cows come home</Header>
<div class="links">
	{#each difficulties as difficulty}
		{@const { total, solved, first } = getSolvedCount(difficulty.key)}
		{#if difficulty.key === 'learn' && solved === 0}
			<a href="/{difficulty.key}/{first.board}">
				<h2>{difficulty.name}</h2>
				<div class="description">Solved {solved} out of {total}</div>
			</a>
		{:else}
			<a href="/{difficulty.key}">
				<h2>{difficulty.name}</h2>
				<div class="description">Solved {solved} out of {total}</div>
			</a>
		{/if}
	{/each}
</div>

<style>
	.links {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 16px;
		gap: 16px;
	}

	.links a {
		display: block;
		padding: 8px;
		width: max(50%, 300px);
		text-align: center;
		background-color: rgba(255, 255, 255, 0.8);
		border-radius: 8px;
		border: 1px solid rgba(0, 0, 0, 0.2);
		text-decoration: none;
	}

	.links a:hover {
		background-color: rgba(255, 255, 255, 0.4);
	}

	h2 {
		margin: 0;
		margin-bottom: 4px;
		font-size: 1.25rem;
	}

	.description {
		color: rgba(0, 0, 0, 0.6);
	}
</style>
