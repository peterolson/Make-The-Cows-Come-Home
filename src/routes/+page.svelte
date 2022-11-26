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
	<title>Make the Cows Come Home</title>
	<meta name="description" content="Puzzle game" />
</svelte:head>

<Header difficulty="none">Make the Cows Come Home</Header>
<div class="images">
	<img src="/img/cow.svg" width="100" height="100" alt="cow" />
	<img src="/img/barn.svg" width="100" height="100" alt="barn" />
	<img src="/img/home.svg" width="100" height="100" alt="home" />
	<img src="/img/person.svg" width="100" height="100" alt="person" />
</div>
<div class="links">
	{#each difficulties as difficulty}
		{@const { total, solved, first } = getSolvedCount(difficulty.key)}
		{@const href =
			difficulty.key === 'learn' && solved === 0
				? `/${difficulty.key}/${first.board}`
				: `/${difficulty.key}`}
		<a {href} class={difficulty.key}>
			<h2>{difficulty.name}</h2>
			<div class="description">Solved {solved} out of {total}</div>
		</a>
	{/each}
</div>

<style>
	.images {
		margin: 16px auto;
		margin-bottom: 0;
		text-align: center;
	}
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
		background-color: rgba(255, 255, 255, 0.95);
		border-radius: 8px;
		border: 1px solid rgba(0, 0, 0, 0.2);
		text-decoration: none;
		color: rgba(255, 255, 255, 1);
	}

	.links a:hover {
		opacity: 0.8;
	}

	h2 {
		margin: 0;
		margin-bottom: 4px;
		font-size: 1.25rem;
	}

	.description {
		color: rgba(255, 255, 255, 1);
	}

	a.learn {
		background-color: var(--color-theme-1);
	}

	a.easy {
		background-color: var(--color-bg-easy);
	}

	a.moderate {
		background-color: var(--color-bg-moderate);
	}

	a.hard {
		background-color: var(--color-bg-hard);
	}

	a.insane {
		background-color: var(--color-bg-insane);
	}

	img {
		width: 20%;
		max-width: 100px;
	}
</style>
