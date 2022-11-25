<script lang="ts">
	import Button from '$lib/ui/Button.svelte';
	import Header from '$lib/ui/Header.svelte';
	import Stars from '$lib/ui/Stars.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	function getMoveCounts(puzzleString: string) {
		const bestMoves = +puzzleString.split('~')[0];
		const userMoves =
			typeof localStorage !== 'undefined' ? localStorage.getItem(puzzleString) || 0 : 0;
		return { bestMoves, userMoves: +userMoves };
	}
</script>

<svelte:head>
	<title>{data.name}</title>
</svelte:head>

<Header difficulty={data.key}>
	{data.name}
	<slot slot="left">
		<a href="/"><Button icon="home_page" inheritBackground /></a>
	</slot>
</Header>

<div class="grid">
	{#each data.puzzleList as puzzle, i}
		{@const { userMoves, bestMoves } = getMoveCounts(puzzle.board)}
		<a href="/{data.key}/{puzzle.board}">
			<div>
				<h3>{data.prefix}{i + 1}</h3>
				<Stars {bestMoves} {userMoves} />
				<div class="description">
					{#if userMoves}
						Solved in {userMoves} moves
					{:else}
						Not yet solved
					{/if}
				</div>
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
		color: rgba(0, 0, 0, 0.8);
	}

	.description {
		color: rgba(0, 0, 0, 0.7);
		margin-top: 4px;
		font-size: 0.725rem;
	}
</style>
