<script lang="ts">
	import { fade } from 'svelte/transition';
	import Button from './Button.svelte';

	export let hint: string;
	export let onClose: () => void;
</script>

<div class="modal" in:fade out:fade on:click={onClose} on:keyup={onClose}>
	<div class="hint" on:click={(e) => e.stopPropagation()} on:keyup={(e) => e.stopPropagation()}>
		{#each hint.split('\n') as line}
			<p>{line}</p>
		{/each}
		<div class="actions">
			<Button fullWidth onClick={onClose}>OK</Button>
		</div>
	</div>
</div>

<style>
	.modal {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.hint {
		font-size: 1.5rem;
		font-weight: bold;
		text-align: center;
		margin: 1rem;
		padding: 1rem;
		background: rgba(255, 255, 255, 0.975);
		border: 2px solid rgba(0, 0, 0, 0.7);
		border-radius: 8px;
	}

	.actions {
		display: inline-block;
		margin: auto;
		width: 200px;
	}
</style>
