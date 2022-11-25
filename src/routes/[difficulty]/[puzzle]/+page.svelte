<script lang="ts">
	import Puzzle from '$lib/ui/Puzzle.svelte';
	import Button from '$lib/ui/Button.svelte';
	import Header from '$lib/ui/Header.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	export let nextLink: HTMLAnchorElement;
	export let difficultyLink: HTMLAnchorElement;
</script>

<svelte:head>
	<title>{data.title}</title>
</svelte:head>

<div class="column">
	<Header difficulty={data.key}>
		{data.title}
		<slot slot="left">
			<a href="/"><Button icon="home_page" inheritBackground /></a>
			<a href="/{data.key}" bind:this={difficultyLink}><Button icon="menu" inheritBackground /></a>
			{#if data.prevPuzzle}
				<a href={data.prevPuzzle}>
					<Button icon="previous" inheritBackground />
				</a>
			{/if}
		</slot>
		<slot slot="right">
			{#if data.nextPuzzle}
				<a href={data.nextPuzzle} bind:this={nextLink}>
					<Button icon="next" inheritBackground />
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
				difficultyKey={data.key}
				hint={data.hint}
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
