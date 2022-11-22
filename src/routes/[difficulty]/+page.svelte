<script lang="ts">
	import Button from '$lib/ui/Button.svelte';
	import Header from '$lib/ui/Header.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	function getStarType(puzzleString: string) {
		const bestMoves = +puzzleString.split('~')[0];
		const userMoves =
			typeof localStorage !== 'undefined' ? localStorage.getItem(puzzleString) || 0 : 0;
		let starType = 'empty';
		let starText = '';
		if (userMoves <= bestMoves) {
			starType = 'gold';
			starText = '★★★';
		} else if (userMoves <= (bestMoves * 6) / 5 || userMoves === bestMoves + 1) {
			starType = 'silver';
			starText = '★★';
		} else if (userMoves > bestMoves) {
			starType = 'bronze';
			starText = '★';
		}
		return {
			bestMoves,
			userMoves,
			starType,
			starText
		};
	}
</script>

<svelte:head>
	<title>{data.name}</title>
	<meta name="description" content="Puzzle game" />
</svelte:head>

<Header>
	{data.name}
	<slot slot="left">
		<a href="/"><Button icon="home_page" /></a>
	</slot>
</Header>

<div class="grid">
	{#each data.puzzleList as puzzle, i}
		{@const { bestMoves, userMoves, starType, starText } = getStarType(puzzle.board)}
		<a href="/{data.key}/{puzzle.board}">
			<div>
				<h3>{data.prefix}{i + 1}</h3>
				{#if userMoves}
					<div
						class="star"
						class:gold={starType === 'gold'}
						class:silver={starType === 'silver'}
						class:bronze={starType === 'bronze'}
					>
						{starText}
					</div>
					<div class="description">Solved in {userMoves} moves</div>
				{:else}
					<div class="star">…</div>
					<div class="description">Not yet solved</div>
				{/if}
			</div>
		</a>
	{/each}
</div>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
		grid-gap: 12px;
		padding: 12px;
	}

	.grid > a {
		display: block;
		padding: 1rem;
		border: 1px solid #ccc;
		border-radius: 5px;
		background-color: rgba(255, 255, 255, 0.9);
		text-align: center;
		text-decoration: none;
		font-size: small;
	}

	.grid > a:hover {
		background-color: rgba(255, 255, 255, 0.5);
	}

	h3 {
		margin: 0;
		font-size: medium;
	}

	.description {
		color: rgba(0, 0, 0, 0.7);
		margin-top: 4px;
		font-size: 0.725rem;
	}

	.star {
		font-size: 1.5rem;
	}
	.star.gold {
		color: #ffd700;
	}
	.star.silver {
		color: #c0c0c0;
	}
	.star.bronze {
		color: #cd7f32;
	}
</style>
