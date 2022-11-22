<script>
	import Button from './Button.svelte';
</script>

<header>
	<div>
		<slot name="left" />
	</div>
	<h1><slot /></h1>
	<div>
		<slot name="right" />
	</div>
</header>

<style>
	header {
		height: 64px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
		background-color: var(--color-theme-1);
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		margin-bottom: 3px;
		box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
		padding: 0 16px;
	}

	header div {
		display: flex;
	}

	header h1 {
		font-size: 22px;
		color: rgba(255, 255, 255, 0.95);
	}
</style>
