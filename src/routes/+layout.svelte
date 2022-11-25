<script>
	import './styles.css';
</script>

<main>
	<slot />
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		overflow: auto;
		height: 100%;
	}
</style>
