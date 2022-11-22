<script lang="ts">
	import Button from '$lib/ui/Button.svelte';
	import Header from '$lib/ui/Header.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
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
		<a href="/{data.key}/{puzzle.board}">
			<div>
				<h3>{data.prefix}{i + 1}</h3>
				{puzzle.board.split('~')[0]} moves
				<div class="description">Not yet solved</div>
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
	}

	.grid > a:hover {
		background-color: rgba(255, 255, 255, 0.5);
	}

	h3 {
		margin: 4px;
	}

	.description {
		color: rgba(0, 0, 0, 0.7);
		margin-top: 4px;
		font-size: small;
	}
</style>
