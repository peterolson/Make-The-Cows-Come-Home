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

{#each data.puzzleList as puzzle, i}
	<div>
		<a href="/{data.key}/{puzzle.board}">{data.prefix}{i + 1}</a>
		{puzzle.board.split('~')[0]} moves
	</div>
{/each}
