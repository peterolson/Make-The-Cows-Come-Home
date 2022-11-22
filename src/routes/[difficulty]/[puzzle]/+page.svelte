<script lang="ts">
	import Puzzle from '$lib/ui/Puzzle.svelte';
	import Button from '$lib/ui/Button.svelte';
	import Header from '$lib/ui/Header.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	export let nextLink: HTMLAnchorElement;
	export let difficultyLink: HTMLAnchorElement;
</script>

<div class="column">
	<Header>
		{data.title}
		<slot slot="left">
			<a href="/"><Button icon="home_page" /></a>
			<a href="/{data.key}" bind:this={difficultyLink}><Button icon="menu" /></a>
			{#if data.prevPuzzle}
				<a href="/{data.key}/{data.prevPuzzle}">
					<Button icon="previous" />
				</a>
			{/if}
		</slot>
		<slot slot="right">
			{#if data.nextPuzzle}
				<a href="/{data.key}/{data.nextPuzzle}" bind:this={nextLink}>
					<Button icon="next" />
				</a>
			{/if}
		</slot>
	</Header>
	<div class="board">
		{#key data.puzzleString}
			<Puzzle
				puzzleString={data.puzzleString}
				{nextLink}
				{difficultyLink}
				difficultyName={data.name}
			/>
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

	.board {
		flex: 1;
		display: flex;
		flex-direction: column;
	}
</style>
