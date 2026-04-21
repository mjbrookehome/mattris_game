import { describe, it, expect } from 'vitest';
import { createBoard, lockPiece, clearLines, isValidPosition, getGhostY } from '../../src/game/board';
import { Piece } from '../../src/game/tetrominoes';
import { BOARD_ROWS, BOARD_COLS } from '../../src/game/constants';

function makePiece(overrides: Partial<Piece> = {}): Piece {
  return {
    type: 'I',
    rotation: 0,
    x: 3,
    y: 1,
    ...overrides,
  };
}

describe('board', () => {
  describe('createBoard', () => {
    it('creates a board with correct dimensions', () => {
      const board = createBoard();
      expect(board).toHaveLength(BOARD_ROWS);
      expect(board[0]).toHaveLength(BOARD_COLS);
    });

    it('initialises all cells to null', () => {
      const board = createBoard();
      for (const row of board) {
        for (const cell of row) {
          expect(cell).toBeNull();
        }
      }
    });
  });

  describe('lockPiece', () => {
    it('writes piece cells to the board', () => {
      const board = createBoard();
      // I-piece at rotation 0, row 1, col 3 => fills [3,4,5,6] in row 2
      const piece: Piece = makePiece({ type: 'I', rotation: 0, x: 3, y: 1 });
      const result = lockPiece(board, piece);
      // Shape row 1 of I-rotation-0 is [1,1,1,1]
      expect(result[2][3]).toBe('I');
      expect(result[2][4]).toBe('I');
      expect(result[2][5]).toBe('I');
      expect(result[2][6]).toBe('I');
    });

    it('does not mutate the original board', () => {
      const board = createBoard();
      lockPiece(board, makePiece());
      expect(board[2][3]).toBeNull();
    });
  });

  describe('clearLines', () => {
    it('returns 0 lines cleared on an empty board', () => {
      const board = createBoard();
      const { linesCleared } = clearLines(board);
      expect(linesCleared).toBe(0);
    });

    it('clears a single full row', () => {
      const board = createBoard();
      board[BOARD_ROWS - 1] = Array(BOARD_COLS).fill('I');
      const { board: cleared, linesCleared } = clearLines(board);
      expect(linesCleared).toBe(1);
      expect(cleared[BOARD_ROWS - 1].every(c => c === null)).toBe(true);
    });

    it('clears 2 full rows (Double)', () => {
      const board = createBoard();
      board[BOARD_ROWS - 1] = Array(BOARD_COLS).fill('T');
      board[BOARD_ROWS - 2] = Array(BOARD_COLS).fill('T');
      const { linesCleared } = clearLines(board);
      expect(linesCleared).toBe(2);
    });

    it('clears 3 full rows (Triple)', () => {
      const board = createBoard();
      for (let i = 1; i <= 3; i++) {
        board[BOARD_ROWS - i] = Array(BOARD_COLS).fill('S');
      }
      const { linesCleared } = clearLines(board);
      expect(linesCleared).toBe(3);
    });

    it('clears 4 full rows simultaneously (Tetris)', () => {
      const board = createBoard();
      for (let i = 1; i <= 4; i++) {
        board[BOARD_ROWS - i] = Array(BOARD_COLS).fill('I');
      }
      const { linesCleared } = clearLines(board);
      expect(linesCleared).toBe(4);
    });

    it('shifts remaining rows down after clearing', () => {
      const board = createBoard();
      // Put a marker cell in row BOARD_ROWS-2, col 0
      board[BOARD_ROWS - 2][0] = 'J';
      // Fill the last row to be cleared
      board[BOARD_ROWS - 1] = Array(BOARD_COLS).fill('I');
      const { board: cleared } = clearLines(board);
      // The marker should have shifted down by 1
      expect(cleared[BOARD_ROWS - 1][0]).toBe('J');
    });

    it('preserves the board size after clearing', () => {
      const board = createBoard();
      board[BOARD_ROWS - 1] = Array(BOARD_COLS).fill('I');
      const { board: cleared } = clearLines(board);
      expect(cleared).toHaveLength(BOARD_ROWS);
    });
  });

  describe('isValidPosition', () => {
    it('returns true for a piece in a valid position', () => {
      const board = createBoard();
      const piece = makePiece({ x: 3, y: 0 });
      expect(isValidPosition(board, piece)).toBe(true);
    });

    it('returns false when piece is out of bounds on the left', () => {
      const board = createBoard();
      const piece = makePiece({ x: -1, y: 5 });
      expect(isValidPosition(board, piece)).toBe(false);
    });

    it('returns false when piece is out of bounds on the right', () => {
      const board = createBoard();
      const piece = makePiece({ x: 8, y: 5 }); // I piece at x=8 would go to col 11
      expect(isValidPosition(board, piece)).toBe(false);
    });

    it('returns false when piece collides with a locked cell', () => {
      const board = createBoard();
      board[2][3] = 'O';
      const piece = makePiece({ type: 'I', rotation: 0, x: 3, y: 1 });
      expect(isValidPosition(board, piece)).toBe(false);
    });
  });

  describe('getGhostY', () => {
    it('returns the lowest valid Y position', () => {
      const board = createBoard();
      const piece = makePiece({ type: 'O', rotation: 0, x: 3, y: 0 });
      const ghostY = getGhostY(board, piece);
      // O piece is 2 rows tall, on empty board should drop to BOARD_ROWS - 2
      expect(ghostY).toBe(BOARD_ROWS - 2);
    });

    it('stops above locked cells', () => {
      const board = createBoard();
      // Fill the bottom row
      board[BOARD_ROWS - 1] = Array(BOARD_COLS).fill('I');
      const piece = makePiece({ type: 'O', rotation: 0, x: 3, y: 0 });
      const ghostY = getGhostY(board, piece);
      expect(ghostY).toBe(BOARD_ROWS - 3);
    });
  });
});
