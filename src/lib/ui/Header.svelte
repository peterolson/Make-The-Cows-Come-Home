<script lang="ts">
	import type { DifficultyKey } from '$lib/puzzle/PuzzleListNames';

	export let difficulty: DifficultyKey | 'none';
</script>

<header class={difficulty}>
	<div>
		<slot name="left" />
	</div>
	<h1><slot /></h1>
	<div>
		<slot name="right" />
	</div>
</header>

<div class={difficulty} class:background={true} />

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

	.learn {
		background-color: var(--color-theme-1);
	}

	header.easy {
		background-color: var(--color-bg-easy);
	}

	header.moderate {
		background-color: var(--color-bg-moderate);
	}

	header.hard {
		background-color: var(--color-bg-hard);
	}

	header.insane {
		background-color: var(--color-bg-insane);
	}

	header.none {
		background-color: var(--color-bg-none);
	}

	.background {
		background-image: linear-gradient(rgb(145, 148, 156), rgb(114, 143, 169));
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: -1;
	}

	.background.easy {
		background-image: linear-gradient(hsl(103, 17%, 52%), rgb(70, 139, 94));
	}

	.background.moderate {
		background-image: linear-gradient(rgb(155, 150, 114), rgb(136, 115, 64));
	}

	.background.hard {
		background-image: linear-gradient(rgb(142, 94, 94), rgb(95, 41, 41));
	}

	.background.insane {
		background-image: linear-gradient(rgb(53, 53, 53), rgb(19, 19, 19));
	}

	.background.none {
		background-image: linear-gradient(rgb(233, 234, 236), rgb(203, 204, 205));
	}
</style>
