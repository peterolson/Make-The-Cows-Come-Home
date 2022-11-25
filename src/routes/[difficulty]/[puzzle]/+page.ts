import { puzzles } from '$lib/puzzle/PuzzleList';
import { difficulties } from '$lib/puzzle/PuzzleListNames';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const difficulty = difficulties.find((d) => d.key === params.difficulty);
	if (!difficulty) {
		throw error(404, 'Not found');
	}
	const puzzleString = params.puzzle;
	const byDifficulty = puzzles.filter((p) => p.difficulty === difficulty.key);
	const difficultyIndex = byDifficulty.findIndex((p) => p.board === puzzleString);
	const puzzleIndex = puzzles.findIndex((puzzle) => puzzle.board === puzzleString);
	const title = difficulty.prefix + (difficultyIndex + 1);
	const nextPuzzle = puzzles[puzzleIndex + 1];
	const prevPuzzle = puzzles[puzzleIndex - 1];
	let nextPuzzleLink = '';
	let prevPuzzleLink = '';
	if (nextPuzzle) {
		nextPuzzleLink = `/${nextPuzzle.difficulty}/${nextPuzzle.board}`;
	}
	if (prevPuzzle) {
		prevPuzzleLink = `/${prevPuzzle.difficulty}/${prevPuzzle.board}`;
	}
	const hint = puzzles[puzzleIndex]?.hint || '';
	return {
		...difficulty,
		title,
		puzzleString,
		nextPuzzle: nextPuzzleLink,
		prevPuzzle: prevPuzzleLink,
		index: puzzleIndex,
		hint
	};
};
