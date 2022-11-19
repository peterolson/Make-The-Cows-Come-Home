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

export class Board {
	gridType: GridType;
	width: number;
	height: number;
	hasOddRow: boolean;
	constructor(gridType: GridType, width: number, height: number, hasOddRow: boolean) {
		this.gridType = gridType;
		this.width = width;
		this.height = height;
		this.hasOddRow = hasOddRow;
	}
}

export type RectangularCoords = {
	x: number;
	y: number;
};

export type RectangularSpace = {
	pieceType: PieceType | null;
	coords: RectangularCoords;
};

export class RectangularBoard extends Board {
	spaces: RectangularSpace[];
	constructor(width: number, height: number) {
		super(GridType.Rectangular, width, height, false);
		this.spaces = [];
		for (let x = 0; x < width; x++) {
			for (let y = 0; y < height; y++) {
				this.spaces.push({ pieceType: null, coords: { x, y } });
			}
		}
	}

	getSpaceByCoords(coords: RectangularCoords): RectangularSpace | undefined {
		return this.spaces.find((space) => space.coords.x === coords.x && space.coords.y === coords.y);
	}

	getValidMovesFrom(
		coords: RectangularCoords
	): { destination: RectangularSpace; puller: RectangularSpace }[] {
		return getValidMovesFrom<RectangularCoords, RectangularSpace>(
			coords,
			this.getSpaceByCoords.bind(this),
			RectangularBoard.directions
		);
	}

	addPiece(coords: RectangularCoords, pieceType: PieceType) {
		const space = this.spaces.find(
			(space) => space.coords.x === coords.x && space.coords.y === coords.y
		);
		if (space) {
			space.pieceType = pieceType;
		} else {
			throw new Error(`No space found at ${coords.x}, ${coords.y}`);
		}
	}

	movePiece(from: RectangularCoords, to: RectangularCoords) {
		return moveTo<RectangularCoords>(from, to, this.getSpaceByCoords.bind(this));
	}
	isSolved(): boolean {
		return isSolved(this);
	}

	static directions = [
		(coords: RectangularCoords) => ({ x: coords.x - 1, y: coords.y }),
		(coords: RectangularCoords) => ({ x: coords.x + 1, y: coords.y }),
		(coords: RectangularCoords) => ({ x: coords.x, y: coords.y - 1 }),
		(coords: RectangularCoords) => ({ x: coords.x, y: coords.y + 1 })
	];

	getSpaceSize(): number {
		const width = 100 / this.width;
		const height = 100 / this.height;
		return Math.min(width, height);
	}
	getLeftOffset(): number {
		return (100 - this.getSpaceSize() * this.width) / 2;
	}
	getTopOffset(): number {
		return (100 - this.getSpaceSize() * this.height) / 2;
	}
	getCoordsCSS(coords: Coords): string {
		if (!('x' in coords)) {
			throw new Error('Invalid coords');
		}
		const spaceSize = this.getSpaceSize();
		const left = this.getLeftOffset() + coords.x * spaceSize;
		const top = this.getTopOffset() + coords.y * spaceSize;
		return `left: ${left}%; top: ${top}%; width: ${spaceSize}%; height: ${spaceSize}%;`;
	}

	serialize() {
		return serialize(this.width, this.height, this.hasOddRow, this.spaces);
	}

	deserialize(serialized: string): RectangularBoard {
		return deserialize(this, serialized) as RectangularBoard;
	}
}

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

export class HexagonalBoard extends Board {
	spaces: HexagonalSpace[];
	constructor(width: number, height: number, hasOddRow: boolean) {
		super(GridType.Hexagonal, width, height, hasOddRow);
		this.spaces = [];
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

	getSpaceByCoords(coords: HexagonalCoords): HexagonalSpace | undefined {
		return this.spaces.find(
			(space) =>
				space.coords.a === coords.a && space.coords.r === coords.r && space.coords.c === coords.c
		);
	}

	addPiece(coords: HexagonalCoords, pieceType: PieceType) {
		const space = this.getSpaceByCoords(coords);
		if (space) {
			space.pieceType = pieceType;
		} else {
			throw new Error(`No space found at ${coords.a}, ${coords.r}, ${coords.c}`);
		}
	}

	static directions = [
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
	];

	getValidMovesFrom(
		coords: HexagonalCoords
	): { destination: HexagonalSpace; puller: HexagonalSpace }[] {
		return getValidMovesFrom<HexagonalCoords, HexagonalSpace>(
			coords,
			this.getSpaceByCoords.bind(this),
			HexagonalBoard.directions
		);
	}

	isSolved(): boolean {
		return isSolved(this);
	}

	movePiece(from: HexagonalCoords, to: HexagonalCoords) {
		return moveTo<HexagonalCoords>(from, to, this.getSpaceByCoords.bind(this));
	}

	getSpaceSize(): number {
		const width = 100 / (this.width + 0.5);
		const height = 100 / ((this.height + (this.hasOddRow ? 0 : 0.5)) * SQRT_3);
		return Math.min(width, height);
	}

	getLeftOffset(): number {
		const spaceSize = this.getSpaceSize();
		return (100 - spaceSize * (this.width + 0.5)) / 2;
	}

	getTopOffset(): number {
		const spaceSize = this.getSpaceSize();
		return (100 - spaceSize * (this.height + (this.hasOddRow ? -0.4 : 0.1)) * SQRT_3) / 2;
	}

	getCoordsCSS(coords: Coords): string {
		if (!('a' in coords)) {
			throw new Error('Invalid coords');
		}
		const { a, r, c } = coords;
		const spaceSize = this.getSpaceSize();
		const leftOffset = this.getLeftOffset();
		const topOffset = this.getTopOffset();
		const x = leftOffset + (a / 2 + c) * spaceSize;
		const y = topOffset + (a / 2 + r) * SQRT_3 * spaceSize;
		return `left: ${x}%; top: ${y}%; width: ${spaceSize}%; height: ${spaceSize}%;`;
	}

	serialize() {
		return serialize(this.width, this.height, this.hasOddRow, this.spaces);
	}

	deserialize(serialized: string): HexagonalBoard {
		return deserialize(this, serialized) as HexagonalBoard;
	}
}

function getValidMovesFrom<Coords, Space extends { pieceType: PieceType | null }>(
	coords: Coords,
	getSpaceByCoords: (x: Coords) => Space | undefined,
	directions: ((x: Coords) => Coords)[]
): { destination: Space; puller: Space }[] {
	const moves: { destination: Space; puller: Space }[] = [];
	const space = getSpaceByCoords(coords);
	if (!space || (space.pieceType !== PieceType.Person && space.pieceType !== PieceType.Cow)) {
		return moves; // can't move from this space
	}
	const thisType = space.pieceType;
	for (const direction of directions) {
		let newCoords = coords;
		let space, prevSpace;
		do {
			newCoords = direction(newCoords);
			space = getSpaceByCoords(newCoords);
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

function moveTo<Coords>(
	from: Coords,
	to: Coords,
	getSpaceByCoords: (x: Coords) => Space | undefined
) {
	const fromSpace = getSpaceByCoords(from);
	const toSpace = getSpaceByCoords(to);
	if (fromSpace && toSpace) {
		if (!toSpace.pieceType) {
			toSpace.pieceType = fromSpace.pieceType;
		}
		fromSpace.pieceType = null;
	} else {
		throw new Error(`No space found at given coordinates`);
	}
}

export type Coords = RectangularCoords | HexagonalCoords;
export type Space = RectangularSpace | HexagonalSpace;

function serialize(width: number, height: number, hasOddRow: boolean, spaces: Space[]) {
	return `${width}|${height}|${hasOddRow ? 1 : 0}|${spaces
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

function deserialize(object: HexagonalBoard | RectangularBoard, string: string) {
	const [width, height, hasOddRow, pieces] = string.split('|');
	const board =
		object instanceof HexagonalBoard
			? new HexagonalBoard(parseInt(width), parseInt(height), !!+hasOddRow)
			: new RectangularBoard(parseInt(width), parseInt(height));
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

function isSolved(board: RectangularBoard | HexagonalBoard) {
	let personCount = 0;
	let cowCount = 0;
	let homeCount = 0;
	let barnCount = 0;
	for (const space of board.spaces) {
		if (space.pieceType === PieceType.Person) personCount++;
		if (space.pieceType === PieceType.Cow) cowCount++;
		if (space.pieceType === PieceType.Home) homeCount++;
		if (space.pieceType === PieceType.Barn) barnCount++;
	}
	return personCount * homeCount + cowCount * barnCount === 0;
}

export function createBoardFromString(serialized: string) {
	if (serialized.includes('~')) {
		serialized = serialized.split('~')[1];
	}
	const type = serialized[0];
	const board = type === 'R' ? new RectangularBoard(0, 0) : new HexagonalBoard(0, 0, false);
	return board.deserialize(serialized.slice(1));
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
