<script lang="ts">
	import Button from './Button.svelte';
	import Stars from './Stars.svelte';
	import { fade, fly } from 'svelte/transition';

	export let onReset: () => void;
	export let userMoves: number;
	export let bestMoves: number;
	export let nextLink: HTMLAnchorElement;
	export let difficultyLink: string;
	export let difficultyName: string;

	const congratsTexts = [
		'Good job!',
		'Nice!',
		'Well done!',
		'Great job!',
		'Awesome!',
		'Fantastic!',
		'Brilliant!',
		'Superb!',
		'Excellent!'
	];
	const congratsText = congratsTexts[Math.floor(Math.random() * congratsTexts.length)];

	let hidden = false;

	function hide() {
		hidden = true;
	}
</script>

<div class="modal" in:fade on:click={hide} on:keyup={hide} class:hidden>
	<div
		class="modal-content"
		in:fade={{ duration: 1000 }}
		on:click={(e) => e.stopPropagation()}
		on:keyup={(e) => e.stopPropagation()}
	>
		<h1>🥳 {congratsText} 🎉</h1>
		<p>You solved the puzzle in <strong>{userMoves}</strong> move{userMoves === 1 ? '' : 's'}.</p>
		<Stars {bestMoves} {userMoves} large />
		<p class="secondary">
			{#if userMoves <= bestMoves}
				You found the best solution!
			{:else}
				Best solution: <strong>{bestMoves}</strong> move{bestMoves === 1 ? '' : 's'}.
			{/if}
		</p>
		<div class="links">
			<Button icon="reset" onClick={onReset} fullWidth>Play again</Button>
			{#if nextLink}
				<Button icon="next" fullWidth onClick={() => nextLink.click()}>Next puzzle</Button>
			{/if}
			<a href={difficultyLink}><Button icon="menu" fullWidth>{difficultyName}</Button></a>
			<a href="/"><Button icon="home_page" fullWidth>Home</Button></a>
		</div>
	</div>
</div>

<style>
	.modal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 100;
	}

	.modal-content {
		background: white;
		padding: 1rem;
		margin: 1rem;
		border-radius: 5px;
		text-align: center;
		border: 2px solid rgba(0, 0, 0, 0.7);
	}

	.links {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin: 8px;
	}

	h1 {
		margin: 8px 0;
		font-size: 30px;
	}

	p {
		margin: 0;
	}

	.secondary {
		color: rgba(0, 0, 0, 0.6);
	}

	a {
		text-decoration: none;
	}

	.hidden {
		display: none;
	}
</style>
