export enum GridType {
	Rectangular = 'rectangle',
	Hexagonal = 'hexagon'
}

export enum PieceType {
	Person = 'person',
	Cow = 'cow',
	Home = 'home',
	Barn = 'barn',
	Empty = 'empty'
}

export type RectangularCoords = {
	x: number;
	y: number;
};

export type RectangularSpace = {
	pieceType: PieceType | null;
	coords: RectangularCoords;
};

const SQRT_3 = Math.sqrt(3);
// uses Hexagonal Efficient Coordinate System
// https://en.wikipedia.org/wiki/Hexagonal_Efficient_Coordinate_System
export type HexagonalCoords = {
	a: number;
	r: number;
	c: number;
};

export type HexagonalSpace = {
	pieceType: PieceType | null;
	coords: HexagonalCoords;
};

export type Coords = RectangularCoords | HexagonalCoords;
export type Space = RectangularSpace | HexagonalSpace;

function genericizeCoords(
	fn: ((coords: RectangularCoords) => Coords) | ((coords: HexagonalCoords) => Coords)
): (coords: Coords) => Coords {
	return fn as (coords: Coords) => Coords;
}

const rectangularDirections: ((coords: Coords) => Coords)[] = [
	(coords: RectangularCoords) => ({ x: coords.x - 1, y: coords.y }),
	(coords: RectangularCoords) => ({ x: coords.x + 1, y: coords.y }),
	(coords: RectangularCoords) => ({ x: coords.x, y: coords.y - 1 }),
	(coords: RectangularCoords) => ({ x: coords.x, y: coords.y + 1 })
].map(genericizeCoords);

const hexagonalDirections: ((coords: Coords) => Coords)[] = [
	(coords: HexagonalCoords) => ({ a: coords.a, r: coords.r, c: coords.c + 1 }),
	(coords: HexagonalCoords) => ({ a: coords.a, r: coords.r, c: coords.c - 1 }),
	(coords: HexagonalCoords) => ({
		a: 1 - coords.a,
		r: coords.r + coords.a,
		c: coords.c - (1 - coords.a)
	}),
	(coords: HexagonalCoords) => ({
		a: 1 - coords.a,
		r: coords.r + coords.a,
		c: coords.c + coords.a
	}),
	(coords: HexagonalCoords) => ({
		a: 1 - coords.a,
		r: coords.r - (1 - coords.a),
		c: coords.c - (1 - coords.a)
	}),
	(coords: HexagonalCoords) => ({
		a: 1 - coords.a,
		r: coords.r - (1 - coords.a),
		c: coords.c + coords.a
	})
].map(genericizeCoords);

export class Board {
	gridType: GridType;
	width: number;
	height: number;
	hasOddRow: boolean;
	spaces: Space[];

	constructor(gridType: GridType, width: number, height: number, hasOddRow: boolean) {
		this.gridType = gridType;
		this.width = width;
		this.height = height;
		this.hasOddRow = hasOddRow;
		this.spaces = [];
		if (gridType === GridType.Rectangular) {
			for (let x = 0; x < width; x++) {
				for (let y = 0; y < height; y++) {
					this.spaces.push({ pieceType: null, coords: { x, y } });
				}
			}
		} else {
			for (let a = 0; a < 2; a++) {
				for (let r = 0; r < height; r++) {
					if (r === height - 1 && a === 1 && hasOddRow) {
						continue;
					}
					for (let c = 0; c < width; c++) {
						this.spaces.push({ pieceType: null, coords: { a, r, c } });
					}
				}
			}
		}
	}

	addPiece(coords: Coords, pieceType: PieceType) {
		const space = this.getSpaceByCoords(coords);
		if (space) {
			space.pieceType = pieceType;
		} else {
			throw new Error(`No space found.`);
		}
	}

	getSpaceByCoords(coords: Coords): Space | undefined {
		if (this.gridType === GridType.Rectangular && 'x' in coords) {
			return (this.spaces as RectangularSpace[]).find(
				(space) => space.coords.x === coords.x && space.coords.y === coords.y
			);
		}
		if (this.gridType === GridType.Hexagonal && 'a' in coords) {
			return (this.spaces as HexagonalSpace[]).find(
				(space) =>
					space.coords.a === coords.a && space.coords.r === coords.r && space.coords.c === coords.c
			);
		}
	}

	movePiece(from: Coords, to: Coords) {
		const fromSpace = this.getSpaceByCoords(from);
		const toSpace = this.getSpaceByCoords(to);
		if (fromSpace && toSpace) {
			if (!toSpace.pieceType) {
				toSpace.pieceType = fromSpace.pieceType;
			}
			fromSpace.pieceType = null;
		} else {
			throw new Error(`No space found at given coordinates`);
		}
	}

	getValidMovesFrom(coords: Coords) {
		const moves: { destination: Space; puller: Space }[] = [];
		const space = this.getSpaceByCoords(coords);
		if (!space || (space.pieceType !== PieceType.Person && space.pieceType !== PieceType.Cow)) {
			return moves; // can't move from this space
		}
		const directions =
			this.gridType === GridType.Rectangular ? rectangularDirections : hexagonalDirections;
		const thisType = space.pieceType;
		for (const direction of directions) {
			let newCoords = coords;
			let space, prevSpace;
			do {
				newCoords = direction(newCoords);
				space = this.getSpaceByCoords(newCoords);
				if (!space) {
					break; // off the board
				}
				if (space.pieceType === PieceType.Empty) {
					break; // can't go over empty spaces
				}
				if (
					space.pieceType === PieceType.Person ||
					space.pieceType === PieceType.Cow ||
					(space.pieceType === PieceType.Home && thisType === PieceType.Cow) ||
					(space.pieceType === PieceType.Barn && thisType === PieceType.Person)
				) {
					if (!prevSpace) {
						break; // no space available
					}
					moves.push({ destination: prevSpace, puller: space });
					break;
				}
				if (
					(space.pieceType === PieceType.Home && thisType === PieceType.Person) ||
					(space.pieceType === PieceType.Barn && thisType === PieceType.Cow)
				) {
					moves.push({ destination: space, puller: space });
					break;
				}

				prevSpace = space;
			} while (space);
		}
		return moves;
	}

	isSolved() {
		let personCount = 0;
		let cowCount = 0;
		let homeCount = 0;
		let barnCount = 0;
		for (const space of this.spaces) {
			if (space.pieceType === PieceType.Person) personCount++;
			if (space.pieceType === PieceType.Cow) cowCount++;
			if (space.pieceType === PieceType.Home) homeCount++;
			if (space.pieceType === PieceType.Barn) barnCount++;
		}
		return personCount * homeCount + cowCount * barnCount === 0;
	}

	getSpaceSize(): number {
		if (this.gridType === GridType.Rectangular) {
			const width = 100 / this.width;
			const height = 100 / this.height;
			return Math.min(width, height);
		}
		const width = 100 / (this.width + 0.5);
		const height = 100 / ((this.height + (this.hasOddRow ? 0 : 0.5)) * SQRT_3);
		return Math.min(width, height);
	}
	getLeftOffset(): number {
		const spaceSize = this.getSpaceSize();
		if (this.gridType === GridType.Rectangular) {
			return (100 - spaceSize * this.width) / 2;
		}
		return (100 - spaceSize * (this.width + 0.5)) / 2;
	}
	getTopOffset(): number {
		const spaceSize = this.getSpaceSize();
		if (this.gridType === GridType.Rectangular) {
			return (100 - spaceSize * this.height) / 2;
		}
		return (100 - spaceSize * (this.height + (this.hasOddRow ? -0.4 : 0.1)) * SQRT_3) / 2;
	}

	getCoordsCSS(coords: Coords): string {
		const spaceSize = this.getSpaceSize();
		const leftOffset = this.getLeftOffset();
		const topOffset = this.getTopOffset();
		if ('x' in coords) {
			const left = leftOffset + coords.x * spaceSize;
			const top = topOffset + coords.y * spaceSize;
			return `left: ${left}%; top: ${top}%; width: ${spaceSize}%; height: ${spaceSize}%;`;
		}
		const { a, r, c } = coords;
		const x = leftOffset + (a / 2 + c) * spaceSize;
		const y = topOffset + (a / 2 + r) * SQRT_3 * spaceSize;
		return `left: ${x}%; top: ${y}%; width: ${spaceSize}%; height: ${spaceSize}%;`;
	}

	serialize() {
		const prefix = this.gridType === GridType.Rectangular ? 'R' : 'H';
		return `${prefix}${this.width}|${this.height}|${this.hasOddRow ? 1 : 0}|${this.spaces
			.map((space) => {
				const pieceType = space.pieceType;
				if (pieceType === PieceType.Empty) return 'E';
				if (pieceType === PieceType.Person) return 'P';
				if (pieceType === PieceType.Cow) return 'O';
				if (pieceType === PieceType.Home) return 'H';
				if (pieceType === PieceType.Barn) return 'B';
				return '_';
			})
			.join('')}`;
	}

	static deserialize(serialized: string) {
		if (serialized.includes('~')) {
			serialized = serialized.split('~')[1];
		}
		const type = serialized[0];
		const gridType = type === 'R' ? GridType.Rectangular : GridType.Hexagonal;
		const [width, height, hasOddRow, pieces] = serialized.slice(1).split('|');
		const board = new Board(gridType, +width, +height, !!+hasOddRow);
		for (let i = 0; i < board.spaces.length; i++) {
			const space = board.spaces[i];
			const c = pieces[i];
			if (c === 'E') space.pieceType = PieceType.Empty;
			else if (c === 'P') space.pieceType = PieceType.Person;
			else if (c === 'O') space.pieceType = PieceType.Cow;
			else if (c === 'H') space.pieceType = PieceType.Home;
			else if (c === 'B') space.pieceType = PieceType.Barn;
			else space.pieceType = null;
		}
		return board;
	}
}

export function coordsEqual(a: Coords | undefined, b: Coords | undefined): boolean {
	if (!a || !b) {
		return false;
	}
	if ('x' in a && 'x' in b) {
		return a.x === b.x && a.y === b.y;
	} else if ('a' in a && 'a' in b) {
		return a.a === b.a && a.r === b.r && a.c === b.c;
	}
	return false;
}
