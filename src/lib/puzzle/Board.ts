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

export type Coords = {
	x: number;
	y: number;
};

export type Space = {
	pieceType: PieceType | null;
	coords: Coords;
};

const SQRT_3 = Math.sqrt(3);
// uses Hexagonal Efficient Coordinate System
// https://en.wikipedia.org/wiki/Hexagonal_Efficient_Coordinate_System
type HexagonalCoords = {
	a: number;
	r: number;
	c: number;
};

const rectToHex = (coords: Coords): HexagonalCoords => {
	const a = coords.y % 2;
	const r = Math.floor(coords.y / 2);
	const c = coords.x;
	return { a, r, c };
};

const hextoRect = (coords: HexagonalCoords): Coords => {
	const x = coords.c;
	const y = coords.r * 2 + coords.a;
	return { x, y };
};

const rectangularDirections: ((coords: Coords) => Coords)[] = [
	(coords) => ({ x: coords.x - 1, y: coords.y }),
	(coords) => ({ x: coords.x + 1, y: coords.y }),
	(coords) => ({ x: coords.x, y: coords.y - 1 }),
	(coords) => ({ x: coords.x, y: coords.y + 1 })
];

const hexDir = (fn: (x: HexagonalCoords) => HexagonalCoords) => (coords: Coords) => {
	const hexCoords = rectToHex(coords);
	const newHexCoords = fn(hexCoords);
	return hextoRect(newHexCoords);
};

const hexagonalDirections: ((coords: Coords) => Coords)[] = [
	hexDir((coords) => ({ a: coords.a, r: coords.r, c: coords.c + 1 })),
	hexDir((coords) => ({ a: coords.a, r: coords.r, c: coords.c - 1 })),
	hexDir((coords) => ({
		a: 1 - coords.a,
		r: coords.r + coords.a,
		c: coords.c - (1 - coords.a)
	})),
	hexDir((coords) => ({
		a: 1 - coords.a,
		r: coords.r + coords.a,
		c: coords.c + coords.a
	})),
	hexDir((coords) => ({
		a: 1 - coords.a,
		r: coords.r - (1 - coords.a),
		c: coords.c - (1 - coords.a)
	})),
	hexDir((coords) => ({
		a: 1 - coords.a,
		r: coords.r - (1 - coords.a),
		c: coords.c + coords.a
	}))
];

export class Board {
	gridType: GridType;
	width: number;
	height: number;
	spaces: Space[];

	constructor(gridType: GridType, width: number, height: number) {
		this.gridType = gridType;
		this.width = width;
		this.height = height;
		this.spaces = [];
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				this.spaces.push({ pieceType: null, coords: { x, y } });
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
		return this.spaces.find((space) => space.coords.x === coords.x && space.coords.y === coords.y);
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

	getSpaceSize(totalWidth: number, totalHeight: number): number {
		if (this.gridType === GridType.Rectangular) {
			const width = totalWidth / this.width;
			const height = totalHeight / this.height;
			return Math.min(width, height);
		}
		const width = totalWidth / (this.width + 0.5);
		const height = totalHeight / this.height;
		return Math.min(width, height);
	}
	getLeftOffset(totalWidth: number, totalHeight: number): number {
		const spaceSize = this.getSpaceSize(totalWidth, totalHeight);
		if (this.gridType === GridType.Rectangular) {
			return (totalWidth - spaceSize * this.width) / 2;
		}
		return (totalWidth - spaceSize * (this.width + 0.5)) / 2;
	}
	getTopOffset(totalWidth: number, totalHeight: number): number {
		const spaceSize = this.getSpaceSize(totalWidth, totalHeight);
		if (this.gridType === GridType.Rectangular) {
			return (totalHeight - spaceSize * this.height) / 2;
		}
		return (totalHeight - (spaceSize * this.height * SQRT_3) / 2) / 2;
	}

	getCoordsCSS(
		coords: Coords,
		parentWidth: number | undefined,
		parentHeight: number | undefined
	): string {
		const width = (parentWidth ? parentWidth : 8) - 8;
		const height = parentHeight ? parentHeight : 0;
		const pageAspectRatio = width / height;
		const boardAspectRatio = this.width / this.height;

		const shouldRotate = pageAspectRatio < 1 !== boardAspectRatio < 1;

		let spaceSize = this.getSpaceSize(width, height);
		let leftOffset = 4 + this.getLeftOffset(width, height);
		let topOffset = this.getTopOffset(width, height);
		let left = coords.x * spaceSize;
		let top = coords.y * spaceSize;
		if (this.gridType === GridType.Hexagonal) {
			const { a, r, c } = rectToHex(coords);
			left = (a / 2 + c) * spaceSize;
			top = (a / 2 + r) * SQRT_3 * spaceSize;
		}
		let addendum = '';
		if (shouldRotate) {
			const board = new Board(this.gridType, this.height, this.width);
			const newSpaceSize = board.getSpaceSize(width, height);
			const scaleFactor = newSpaceSize / spaceSize;
			[left, top] = [top * scaleFactor, left * scaleFactor];
			spaceSize = newSpaceSize;
			leftOffset = 4 + board.getLeftOffset(width, height);
			topOffset = board.getTopOffset(width, height);
			if (this.gridType === GridType.Hexagonal) {
				addendum = `clip-path: polygon(0% 50%, 25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%)`;
				leftOffset += newSpaceSize / 2;
				topOffset -= newSpaceSize / 2;
			}
		}
		return (
			`left: ${leftOffset + left}px; top: ${
				topOffset + top
			}px; width: ${spaceSize}px; height: ${spaceSize}px;` + addendum
		);
	}

	serialize() {
		const prefix = this.gridType === GridType.Rectangular ? 'R' : 'H';
		return `${prefix}${this.width}|${this.height}|${this.spaces
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
		const [width, height, pieces] = serialized.slice(1).split('|');
		const board = new Board(gridType, +width, +height);
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
	return a.x === b.x && a.y === b.y;
}
