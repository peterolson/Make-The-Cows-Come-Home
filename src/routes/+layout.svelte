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
		height: 100vh;
		overflow: auto;
	}
</style>
