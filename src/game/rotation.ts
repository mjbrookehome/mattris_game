import { Board } from './board';
import { Piece, Rotation, WALL_KICKS_I, WALL_KICKS_JLSTZ, getPieceCells } from './tetrominoes';
import { isValidPosition } from './board';

function nextRotation(rotation: Rotation, clockwise: boolean): Rotation {
  if (clockwise) {
    return ((rotation + 1) % 4) as Rotation;
  }
  return ((rotation + 3) % 4) as Rotation;
}

function getKickKey(from: Rotation, to: Rotation): string {
  return `${from}->${to}`;
}

/**
 * Attempts to rotate the piece using SRS wall kicks.
 * Returns the new piece if rotation succeeds, or null if not possible.
 */
export function rotatePiece(board: Board, piece: Piece, clockwise: boolean): Piece | null {
  const toRotation = nextRotation(piece.rotation, clockwise);
  const kickKey = getKickKey(piece.rotation, toRotation);
  const kicks = piece.type === 'I' ? WALL_KICKS_I[kickKey] : WALL_KICKS_JLSTZ[kickKey];

  for (const [dx, dy] of kicks) {
    const candidate: Piece = {
      ...piece,
      rotation: toRotation,
      x: piece.x + dx,
      y: piece.y - dy, // SRS uses inverted Y for kicks
    };
    if (isValidPosition(board, candidate)) {
      return candidate;
    }
  }
  return null;
}

export { getPieceCells };
