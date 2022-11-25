<script lang="ts">
	import type { DifficultyKey } from '$lib/puzzle/PuzzleListNames';

	export let onClick: () => void = () => {};
	export let disabled: boolean = false;
	export let icon: string = '';
	export let fullWidth: boolean = false;
	export let inheritBackground: boolean = false;
	export let difficulty: DifficultyKey | '' = '';
</script>

<button
	{disabled}
	on:click={onClick}
	class:full-width={fullWidth}
	class:inherit-background={inheritBackground}
	class={difficulty}
>
	{#if icon}
		<img src="/img/{icon}.svg" alt="" />
	{/if}

	<slot />
</button>

<style>
	button {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		gap: 2px;
		padding: 8px 12px;
		border: none;
		background-color: #eee;
		cursor: pointer;
		background-color: var(--color-theme-1);
		color: rgba(255, 255, 255, 0.9);
		border-radius: 8px;
	}

	button:hover {
		background-color: #339d9d;
	}

	button[disabled] {
		cursor: not-allowed;
		background-color: #85b6b6;
		opacity: 0.5;
	}

	button.full-width {
		width: 100%;
	}

	button.inherit-background {
		background-color: inherit;
	}
	button.inherit-background:hover {
		background-color: rgba(255, 255, 255, 0.2);
	}

	button img {
		width: 24px;
		height: 24px;
		margin-right: 8px;
		color: rgba(255, 255, 255, 0.9);
	}

	button.learn {
		background-color: var(--color-theme-1);
	}

	button.easy {
		background-color: var(--color-bg-easy);
	}

	button.moderate {
		background-color: var(--color-bg-moderate);
	}

	button.hard {
		background-color: var(--color-bg-hard);
	}

	button.insane {
		background-color: var(--color-bg-insane);
	}
</style>
