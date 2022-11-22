<script lang="ts">
	export let onClick: () => void = () => {};
	export let disabled: boolean = false;
	export let icon: string = '';
	export let fullWidth: boolean = false;
</script>

<button {disabled} on:click={onClick} class:full-width={fullWidth}>
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

	button img {
		width: 24px;
		height: 24px;
		margin-right: 8px;
		color: rgba(255, 255, 255, 0.9);
	}
</style>
