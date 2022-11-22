<script lang="ts">
	export let onClick: () => void = () => {};
	export let disabled: boolean = false;
	export let icon: string = '';
</script>

<button {disabled} on:click={onClick}>
	{#if icon}
		<img src="/img/{icon}.svg" alt="" />
	{/if}

	<slot />
</button>

<style>
	button {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 2px;
		padding: 8px 12px;
		border: none;
		background-color: #eee;
		cursor: pointer;
		background-color: var(--color-theme-1);
		color: rgba(255, 255, 255, 0.9);
	}

	button[disabled] {
		cursor: not-allowed;
		background-color: #ccc;
	}

	button img {
		width: 24px;
		height: 24px;
		margin-right: 8px;
		color: rgba(255, 255, 255, 0.9);
	}
</style>
