import { puzzles } from '$lib/puzzle/PuzzleList';
import { difficulties } from '$lib/puzzle/PuzzleListNames';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
    const difficulty = difficulties.find((d) => d.key === params.difficulty);
    if (!difficulty) {
        throw error(404, 'No difficulty named ' + params.difficulty);
    }
    const puzzleList = puzzles.filter((puzzle) => puzzle.difficulty === difficulty.key);
    return {
        ...difficulty,
        puzzleList
    };
}