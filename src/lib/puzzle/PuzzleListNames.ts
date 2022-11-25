export type DifficultyKey = 'learn' | 'easy' | 'moderate' | 'hard' | 'insane';

export const difficulties: {
	key: DifficultyKey;
	prefix: string;
	name: string;
}[] = [
	{ key: 'learn', name: 'Learn to play', prefix: 'Learn #' },
	{ key: 'easy', name: 'Easy Puzzles', prefix: 'Easy #' },
	{ key: 'moderate', name: 'Moderate Puzzles', prefix: 'Moderate #' },
	{ key: 'hard', name: 'Hard Puzzles', prefix: 'Hard #' },
	{ key: 'insane', name: 'iNsAnE Puzzles', prefix: 'iNsAnE #' }
];
