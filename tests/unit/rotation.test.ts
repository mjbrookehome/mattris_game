import { describe, it, expect } from 'vitest';
import { rotatePiece } from '../../src/game/rotation';
import { createBoard } from '../../src/game/board';
import { Piece } from '../../src/game/tetrominoes';
import { Rotation } from '../../src/game/tetrominoes';

function makePiece(overrides: Partial<Piece> = {}): Piece {
  return {
    type: 'T',
    rotation: 0,
    x: 3,
    y: 5,
    ...overrides,
  };
}

describe('rotation (SRS)', () => {
  it('rotates a T-piece clockwise through all 4 states and back to 0', () => {
    const board = createBoard();
    let piece = makePiece({ type: 'T', rotation: 0, x: 3, y: 5 });
    for (let i = 0; i < 4; i++) {
      const rotated = rotatePiece(board, piece, true);
      expect(rotated).not.toBeNull();
      piece = rotated!;
    }
    expect(piece.rotation).toBe(0);
  });

  it('rotates a T-piece counter-clockwise through all 4 states and back to 0', () => {
    const board = createBoard();
    let piece = makePiece({ type: 'T', rotation: 0, x: 3, y: 5 });
    for (let i = 0; i < 4; i++) {
      const rotated = rotatePiece(board, piece, false);
      expect(rotated).not.toBeNull();
      piece = rotated!;
    }
    expect(piece.rotation).toBe(0);
  });

  it('rotates an I-piece clockwise through all 4 states and back to 0', () => {
    const board = createBoard();
    let piece = makePiece({ type: 'I', rotation: 0, x: 3, y: 5 });
    for (let i = 0; i < 4; i++) {
      const rotated = rotatePiece(board, piece, true);
      expect(rotated).not.toBeNull();
      piece = rotated!;
    }
    expect(piece.rotation).toBe(0);
  });

  it('uses wall kicks to allow I-piece rotation adjacent to left wall', () => {
    const board = createBoard();
    // I-piece at rotation 0 spawns at x=0 (touching left wall)
    // rotation 0 -> 1 should succeed via kick
    const piece = makePiece({ type: 'I', rotation: 0, x: 0, y: 5 });
    const rotated = rotatePiece(board, piece, true);
    expect(rotated).not.toBeNull();
  });

  it('uses wall kicks to allow I-piece rotation adjacent to right wall', () => {
    const board = createBoard();
    // I-piece at x=6 rotation 0 occupies cols 6-9 (right wall)
    const piece = makePiece({ type: 'I', rotation: 0, x: 6, y: 5 });
    const rotated = rotatePiece(board, piece, true);
    expect(rotated).not.toBeNull();
  });

  it('returns null when no kick resolves a blocked rotation', () => {
    const board = createBoard();
    // Box the T-piece in with locked cells on all sides
    // rotation 1 -> 2: block all possible kick positions
    for (let col = 0; col < 10; col++) {
      for (let row = 3; row < 9; row++) {
        board[row][col] = 'I';
      }
    }
    // Clear just the current piece cells (rotation 1 at x=4, y=4)
    // T-piece rotation 1 shape: col 4-5, rows 4-6
    board[4][4] = null;
    board[4][5] = null;
    board[5][4] = null;
    board[5][5] = null;
    board[6][4] = null;
    board[6][5] = null;

    const piece: Piece = { type: 'T', rotation: 1 as Rotation, x: 4, y: 4 };
    const rotated = rotatePiece(board, piece, true);
    expect(rotated).toBeNull();
  });

  it('each rotation produces a different piece orientation', () => {
    const board = createBoard();
    const piece = makePiece({ type: 'T', rotation: 0, x: 3, y: 5 });
    const rotations = new Set<number>([0]);

    let current = piece;
    for (let i = 0; i < 3; i++) {
      const r = rotatePiece(board, current, true);
      expect(r).not.toBeNull();
      current = r!;
      rotations.add(current.rotation);
    }
    expect(rotations.size).toBe(4);
  });
});
