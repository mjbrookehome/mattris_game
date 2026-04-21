import { BOARD_COLS, BOARD_ROWS, PieceType } from './constants';
import { Piece, getPieceCells } from './tetrominoes';

export type Cell = PieceType | null;
export type Board = Cell[][];

/** Creates an empty board */
export function createBoard(): Board {
  return Array.from({ length: BOARD_ROWS }, () => Array(BOARD_COLS).fill(null));
}

/** Deep copies a board */
export function cloneBoard(board: Board): Board {
  return board.map(row => [...row]);
}

/** Returns true if the piece position is valid (in bounds, no collision) */
export function isValidPosition(board: Board, piece: Piece): boolean {
  const cells = getPieceCells(piece);
  for (const [col, row] of cells) {
    if (col < 0 || col >= BOARD_COLS) return false;
    if (row >= BOARD_ROWS) return false;
    if (row >= 0 && board[row][col] !== null) return false;
  }
  return true;
}

/** Locks a piece onto the board (mutates a clone) */
export function lockPiece(board: Board, piece: Piece): Board {
  const next = cloneBoard(board);
  const cells = getPieceCells(piece);
  for (const [col, row] of cells) {
    if (row >= 0 && row < BOARD_ROWS && col >= 0 && col < BOARD_COLS) {
      next[row][col] = piece.type;
    }
  }
  return next;
}

/** Clears full rows and returns the new board plus how many lines were cleared */
export function clearLines(board: Board): { board: Board; linesCleared: number } {
  const remaining = board.filter(row => row.some(cell => cell === null));
  const linesCleared = BOARD_ROWS - remaining.length;
  const emptyRows = Array.from({ length: linesCleared }, () =>
    Array<Cell>(BOARD_COLS).fill(null),
  );
  return { board: [...emptyRows, ...remaining], linesCleared };
}

/** Finds the ghost piece Y position (lowest valid drop) */
export function getGhostY(board: Board, piece: Piece): number {
  let y = piece.y;
  while (isValidPosition(board, { ...piece, y: y + 1 })) {
    y++;
  }
  return y;
}
