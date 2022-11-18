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
    const puzzleList = puzzles.filter((puzzle) => puzzle.difficulty === difficulty.key);
    const puzzleIndex = puzzleList.findIndex((puzzle) => puzzle.board === puzzleString);
    const title = difficulty.prefix + (puzzleIndex + 1);
    const nextPuzzle = puzzleList[puzzleIndex + 1]?.board;
    const prevPuzzle = puzzleList[puzzleIndex - 1]?.board;
    return {
        ...difficulty,
        title,
        puzzleString,
        nextPuzzle,
        prevPuzzle,
        index: puzzleIndex,
    };
}