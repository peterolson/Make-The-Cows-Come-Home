<script lang="ts">
	import { Board, coordsEqual, GridType, PieceType, type Space } from '$lib/puzzle/Board';
	import Button from '$lib/ui/Button.svelte';
	import { confetti } from '@neoconfetti/svelte';
	import PuzzleFinished from './PuzzleFinished.svelte';
	import PuzzleHint from './PuzzleHint.svelte';

	export let puzzleString: string;
	export let nextLink: HTMLAnchorElement;
	export let difficultyLink: HTMLAnchorElement;
	export let difficultyName: string;
	export let hint: string;

	let board = Board.deserialize(puzzleString);
	let showHint = true;

	let activeCell: { space: Space; button: HTMLButtonElement } | undefined;
	let destinations: Space[] = [];
	let pullers: Space[] = [];
	let moveStack: string[] = [board.serialize()];
	let boardNode: HTMLDivElement;
	let lastDestination: Space | undefined;
	let isAnimating = false;
	let hiddenSpaces: Space[] = [];
	let animatingElements = new Set<HTMLImageElement | SVGSVGElement>();
	let boardWidth = 0;
	let boardHeight = 0;

	async function clickSpace(space: Space, button: HTMLButtonElement) {
		if (lastDestination) {
			const validMoves: { destination: Space; puller: Space }[] = board.getValidMovesFrom(
				lastDestination.coords as any
			);
			const matchingMove = validMoves.find((move) =>
				coordsEqual(move.destination.coords, space.coords)
			);
			if (matchingMove) {
				const activeCellIndex = board.spaces.findIndex((x) =>
					coordsEqual(x.coords, lastDestination?.coords)
				);
				const activeCellButton = boardNode.children[activeCellIndex] as HTMLButtonElement;
				activeCell = { space: lastDestination, button: activeCellButton };
				destinations = [matchingMove.destination];
				pullers = [matchingMove.puller];
			}
		}
		if (activeCell) {
			const pullerIndex = pullers.findIndex((puller) => coordsEqual(puller.coords, space.coords));
			const destinationIndex = destinations.findIndex((destination) =>
				coordsEqual(destination.coords, space.coords)
			);
			if (destinationIndex >= 0 || pullerIndex >= 0) {
				const destination = destinations[destinationIndex >= 0 ? destinationIndex : pullerIndex];
				const puller = pullers[pullerIndex >= 0 ? pullerIndex : destinationIndex];
				animateMovement(puller, destination);
				board.movePiece(activeCell?.space?.coords as any, destination.coords as any);
				if (destination.pieceType !== PieceType.Home && destination.pieceType !== PieceType.Barn) {
					hiddenSpaces = [...hiddenSpaces, destination];
				}
				clearSelection();
				if (board.isSolved()) {
					localStorage.setItem(puzzleString, moveStack.length.toString());
				}
				board = board;
				moveStack = [...moveStack, board.serialize()];
				lastDestination = destination;
				return;
			}
		}

		if (coordsEqual(space.coords, activeCell?.space?.coords)) {
			clearSelection();
			return;
		}
		const validMoves = board.getValidMovesFrom(space.coords as any);
		if (!validMoves.length) {
			clearSelection();
			return;
		}
		activeCell = { space, button };
		destinations = validMoves.map((x) => x.destination);
		pullers = validMoves.map((x) => x.puller);
		lastDestination = undefined;
	}

	async function animateMovement(puller: Space, destination: Space) {
		if (!activeCell) return;
		for (const element of animatingElements) {
			element.style.opacity = '0';
			animatingElements.delete(element);
		}
		isAnimating = true;
		const activeButton = activeCell.button;
		const imgNode = activeButton.querySelector('img') as HTMLImageElement;
		const width = imgNode.clientWidth;
		const height = imgNode.clientHeight;
		const left = activeButton.offsetLeft + imgNode.offsetLeft;
		const top = activeButton.offsetTop + imgNode.offsetTop;

		const destinationIndex = board.spaces.findIndex((x) =>
			coordsEqual(x.coords, destination.coords)
		);
		const destinationButton = boardNode.children[destinationIndex] as HTMLButtonElement;
		const destinationLeft = destinationButton.offsetLeft + imgNode.offsetLeft;
		const destinationTop = destinationButton.offsetTop + imgNode.offsetTop;

		const pullerIndex = board.spaces.findIndex((x) => coordsEqual(x.coords, puller.coords));
		const pullerButton = boardNode.children[pullerIndex] as HTMLButtonElement;
		const pullerImg = pullerButton.querySelector('img') as HTMLImageElement;
		const pullerLeft = pullerButton.offsetLeft + imgNode.offsetLeft;
		const pullerTop = pullerButton.offsetTop + imgNode.offsetTop;

		destinations = destinations.filter((x) => coordsEqual(x.coords, destination.coords));
		pullers = pullers.filter((x) => coordsEqual(x.coords, puller.coords));

		const x1 = left + imgNode.offsetWidth / 2;
		const y1 = top + imgNode.offsetHeight / 2;
		const x2 = pullerLeft + pullerImg.offsetWidth / 2;
		const y2 = pullerTop + pullerImg.offsetHeight / 2;

		const imgCopy = imgNode.cloneNode() as HTMLImageElement;
		imgNode.style.display = 'none';
		imgCopy.style.position = 'absolute';
		imgCopy.style.width = width + 'px';
		imgCopy.style.height = height + 'px';
		imgCopy.style.left = left + 'px';
		imgCopy.style.top = top + 'px';
		imgCopy.style.opacity = '1';

		const slopeDown = (x2 <= x1 && y2 <= y1) || (x2 >= x1 && y2 >= y1);

		const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svgElement.style.position = 'absolute';
		svgElement.style.overflow = 'visible';
		svgElement.innerHTML = `<line x1="0%" y1="${slopeDown ? 0 : 100}%" x2="100%" y2="${
			slopeDown ? 100 : 0
		}%" style="stroke:rgba(99, 88, 77, 0.9);stroke-width:6px" stroke-linecap="round" />`;
		boardNode.appendChild(svgElement);
		boardNode.appendChild(imgCopy);
		animatingElements.add(svgElement);
		animatingElements.add(imgCopy);

		const STEP_1_TIME = 200;
		const STEP_2_TIME = 250;
		const STEP_3_TIME = 50;

		const left2 = Math.min(x1, x2) + 'px';
		const top2 = Math.min(y1, y2) + 'px';
		const width2 = Math.max(1, Math.abs(x2 - x1)) + 'px';
		const height2 = Math.max(1, Math.abs(y2 - y1)) + 'px';

		let lineAnimation = svgElement.animate(
			[
				{
					left: x1 + 'px',
					top: y1 + 'px',
					width: '1px',
					height: '1px'
				},
				{
					left: left2,
					top: top2,
					width: width2,
					height: height2
				}
			],
			{
				duration: STEP_1_TIME,
				easing: 'ease-in-out'
			}
		);
		await lineAnimation.finished;

		const x3 = destinationLeft + imgCopy.offsetWidth / 2;
		const y3 = destinationTop + imgCopy.offsetHeight / 2;

		const left3 = Math.min(x2, x3) + 'px';
		const top3 = Math.min(y2, y3) + 'px';
		const width3 = Math.max(1, Math.abs(x3 - x2)) + 'px';
		const height3 = Math.max(1, Math.abs(y3 - y2)) + 'px';

		lineAnimation = svgElement.animate(
			[
				{
					left: left2,
					top: top2,
					width: width2,
					height: height2
				},
				{
					left: left3,
					top: top3,
					width: width3,
					height: height3
				}
			],
			{
				duration: STEP_2_TIME,
				easing: 'ease-in-out'
			}
		);
		svgElement.style.left = left3;
		svgElement.style.top = top3;
		svgElement.style.width = width3;
		svgElement.style.height = height3;

		// animate to destination over 1 second
		const animation = imgCopy.animate(
			[
				{ left: left + 'px', top: top + 'px' },
				{ left: destinationLeft + 'px', top: destinationTop + 'px' }
			],
			{
				duration: STEP_2_TIME,
				easing: 'ease-in-out'
			}
		);
		imgCopy.style.left = destinationLeft + 'px';
		imgCopy.style.top = destinationTop + 'px';
		await animation.finished;

		lineAnimation = svgElement.animate(
			[
				{
					opactiy: 1
				},
				{
					opacity: 0
				}
			],
			{
				duration: STEP_3_TIME,
				easing: 'ease-in-out'
			}
		);
		await lineAnimation.finished;

		boardNode.removeChild(imgCopy);
		boardNode.removeChild(svgElement);
		hiddenSpaces = hiddenSpaces.slice(1);
		isAnimating = false;
	}

	function clearSelection() {
		activeCell = undefined;
		destinations = [];
		pullers = [];
		lastDestination = undefined;
	}

	function undo() {
		if (moveStack.length <= 1) return;
		moveStack = moveStack.slice(0, moveStack.length - 1);
		board = Board.deserialize(moveStack[moveStack.length - 1]);
		clearSelection();
	}

	function reset() {
		moveStack = moveStack.slice(0, 1);
		board = Board.deserialize(moveStack[0]);
		clearSelection();
	}
</script>

<div
	class="board"
	bind:this={boardNode}
	bind:offsetWidth={boardWidth}
	bind:offsetHeight={boardHeight}
>
	{#each board.spaces as space}
		<button
			class="cell"
			disabled={board.isSolved()}
			class:hexagon={board.gridType === GridType.Hexagonal}
			class:rectangle={board.gridType === GridType.Rectangular}
			class:hidden={space.pieceType === PieceType.Empty}
			class:active={coordsEqual(space?.coords, activeCell?.space?.coords)}
			class:puller={pullers.some((x) => coordsEqual(x.coords, space.coords))}
			class:destination={destinations.some((x) => coordsEqual(x.coords, space.coords))}
			style={board.getCoordsCSS(space.coords, boardWidth, boardHeight)}
			on:click={(e) => clickSpace(space, e.currentTarget)}
		>
			{#if space.pieceType && space.pieceType !== PieceType.Empty}
				<img
					src={`/img/${space.pieceType}.svg`}
					alt={space.pieceType}
					class:invisible={hiddenSpaces.some(
						(x) => coordsEqual(x.coords, space.coords) && x.pieceType === space.pieceType
					)}
				/>
			{/if}
		</button>
	{/each}
	{#if board.isSolved() && !isAnimating}
		<PuzzleFinished
			onReset={reset}
			userMoves={moveStack.length - 1}
			bestMoves={+puzzleString.split('~')[0]}
			{nextLink}
			{difficultyLink}
			{difficultyName}
		/>
		<div
			style="position: absolute; left: 50%; top: 0%"
			use:confetti={{
				force: 0.4,
				duration: 4000,
				stageWidth: document.body.offsetWidth,
				stageHeight: document.body.offsetHeight,
				colors: [
					'#ff0a12',
					'#ff7300',
					'#fffb00',
					'#90fe00',
					'#00fff7',
					'#0015ff',
					'#8400ff',
					'#ff00a1'
				]
			}}
		/>
	{/if}
</div>

<div class="actions">
	<Button onClick={undo} disabled={moveStack.length < 2} icon="undo">Undo</Button>
	<Button onClick={reset} disabled={moveStack.length < 2} icon="reset">Reset</Button>
	{#if hint}
		<Button onClick={() => (showHint = true)} icon="hint">Hint</Button>
	{/if}
	Moves: {moveStack.length - 1}
</div>

{#if hint && showHint}
	<PuzzleHint {hint} onClose={() => (showHint = false)} />
{/if}

<style>
	.cell {
		background-color: #fff;
		position: absolute;
		transition: background-color 0.5s;
	}
	.cell:hover {
		background-color: #ddd;
	}

	.hexagon {
		clip-path: polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%);
	}

	.rectangle {
		outline: 1px solid black;
	}

	.hidden {
		display: none;
	}

	.active {
		background-color: rgba(255, 217, 0, 0.6);
	}
	.active:hover {
		background-color: rgba(255, 217, 0, 1);
	}
	.puller {
		background-color: rgba(117, 218, 255, 0.8);
	}
	.puller:hover {
		background-color: rgba(117, 218, 255, 1);
	}
	.destination {
		background-color: rgba(0, 255, 0, 0.5);
	}
	.destination:hover {
		background-color: rgba(0, 255, 0, 0.8);
	}

	.board {
		flex: 1;
		width: 100%;
		position: relative;
	}

	.board img {
		width: 75%;
		height: 75%;
		left: 12.5%;
		top: 12.5%;
		position: absolute;
		object-fit: contain;
	}
	.board img.invisible {
		opacity: 0;
	}

	.board button {
		border: none;
		padding: 0;
		cursor: pointer;
	}

	.actions {
		display: flex;
		flex-direction: row;
		justify-content: center;
		gap: 16px;
		align-items: center;
		padding: 8px;
		box-sizing: border-box;
		height: 52px;
		margin-top: 4px;
		background-color: var(--color-bg-0);
		outline: 1px solid rgba(0, 0, 0, 0.3);
	}
</style>
