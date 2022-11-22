<script lang="ts">
	export let bestMoves: number;
	export let userMoves: number;
	export let large = false;

	function getStarType(bestMoves: number, userMoves: number) {
		let starType: string;
		let starText: string;
		if (userMoves === 0) {
			starType = 'empty';
			starText = '…';
		} else if (userMoves <= bestMoves) {
			starType = 'gold';
			starText = '★★★';
		} else if (userMoves <= (bestMoves * 6) / 5 || userMoves === bestMoves + 1) {
			starType = 'silver';
			starText = '★★';
		} else {
			starType = 'bronze';
			starText = '★';
		}
		return {
			bestMoves,
			userMoves,
			starType,
			starText
		};
	}

	let { starType, starText } = getStarType(bestMoves, userMoves);
</script>

<div
	class="star"
	class:gold={starType === 'gold'}
	class:silver={starType === 'silver'}
	class:bronze={starType === 'bronze'}
	class:large
>
	{starText}
</div>

<style>
	.star {
		font-size: 1.5rem;
	}
	.star.gold {
		color: #ffd700;
	}
	.star.silver {
		color: #c0c0c0;
	}
	.star.bronze {
		color: #cd7f32;
	}
	.star.large {
		font-size: 4rem;
	}
</style>
