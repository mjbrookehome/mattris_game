import { useEffect, useRef } from 'react';
import { Board } from '../game/board';
import { Piece, getPieceCells, TETROMINOES } from '../game/tetrominoes';
import { getGhostY } from '../game/board';
import { PIECE_COLORS, BUFFER_ROWS, BOARD_COLS, VISIBLE_ROWS } from '../game/constants';
import { PieceType } from '../game/constants';

interface GameBoardProps {
  board: Board;
  currentPiece: Piece | null;
  cellSize?: number;
}

function drawCell(ctx: CanvasRenderingContext2D, x: number, y: number, cellSize: number, color: string, ghost = false) {
  ctx.fillStyle = ghost ? PIECE_COLORS.ghost : color;
  ctx.fillRect(x * cellSize + 1, y * cellSize + 1, cellSize - 2, cellSize - 2);

  if (!ghost) {
    // Highlight top-left edge
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillRect(x * cellSize + 1, y * cellSize + 1, cellSize - 2, 3);
    ctx.fillRect(x * cellSize + 1, y * cellSize + 1, 3, cellSize - 2);

    // Shadow bottom-right edge
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(x * cellSize + 1, y * cellSize + cellSize - 4, cellSize - 2, 3);
    ctx.fillRect(x * cellSize + cellSize - 4, y * cellSize + 1, 3, cellSize - 2);
  }
}

export default function GameBoard({ board, currentPiece, cellSize = 32 }: GameBoardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = BOARD_COLS * cellSize;
    const height = VISIBLE_ROWS * cellSize;

    ctx.clearRect(0, 0, width, height);

    // Background grid
    ctx.fillStyle = PIECE_COLORS.empty;
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let r = 0; r <= VISIBLE_ROWS; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * cellSize);
      ctx.lineTo(width, r * cellSize);
      ctx.stroke();
    }
    for (let c = 0; c <= BOARD_COLS; c++) {
      ctx.beginPath();
      ctx.moveTo(c * cellSize, 0);
      ctx.lineTo(c * cellSize, height);
      ctx.stroke();
    }

    // Locked cells (skip buffer rows)
    for (let row = BUFFER_ROWS; row < board.length; row++) {
      for (let col = 0; col < BOARD_COLS; col++) {
        const cell = board[row][col];
        if (cell) {
          const visibleRow = row - BUFFER_ROWS;
          drawCell(ctx, col, visibleRow, cellSize, PIECE_COLORS[cell]);
        }
      }
    }

    if (currentPiece) {
      // Ghost piece
      const ghostY = getGhostY(board, currentPiece);
      const ghostCells = getPieceCells({ ...currentPiece, y: ghostY });
      for (const [col, row] of ghostCells) {
        const visibleRow = row - BUFFER_ROWS;
        if (visibleRow >= 0) drawCell(ctx, col, visibleRow, cellSize, PIECE_COLORS[currentPiece.type], true);
      }

      // Active piece
      const cells = getPieceCells(currentPiece);
      for (const [col, row] of cells) {
        const visibleRow = row - BUFFER_ROWS;
        if (visibleRow >= 0) drawCell(ctx, col, visibleRow, cellSize, PIECE_COLORS[currentPiece.type]);
      }
    }
  }, [board, currentPiece, cellSize]);

  return (
    <canvas
      ref={canvasRef}
      width={BOARD_COLS * cellSize}
      height={VISIBLE_ROWS * cellSize}
      className="border border-slate-600"
      aria-label="Tetris game board"
    />
  );
}

// Mini canvas renderer for piece preview (hold / next)
interface PiecePreviewProps {
  type: PieceType | null;
  dim?: boolean;
  size?: number;
}

export function PiecePreview({ type, dim = false, size = 4 }: PiecePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cellSize = 20;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (!type) return;

    const shape = TETROMINOES[type][0];
    const color = dim ? 'rgba(150,150,150,0.4)' : PIECE_COLORS[type];

    // Centre the piece in the preview box
    let minCol = size, maxCol = 0, minRow = size, maxRow = 0;
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c]) {
          minCol = Math.min(minCol, c);
          maxCol = Math.max(maxCol, c);
          minRow = Math.min(minRow, r);
          maxRow = Math.max(maxRow, r);
        }
      }
    }
    const pieceW = (maxCol - minCol + 1) * cellSize;
    const pieceH = (maxRow - minRow + 1) * cellSize;
    const offsetX = Math.floor((canvas.width - pieceW) / 2);
    const offsetY = Math.floor((canvas.height - pieceH) / 2);

    for (let r = minRow; r <= maxRow; r++) {
      for (let c = minCol; c <= maxCol; c++) {
        if (shape[r][c]) {
          const px = offsetX + (c - minCol) * cellSize;
          const py = offsetY + (r - minRow) * cellSize;
          ctx.fillStyle = color;
          ctx.fillRect(px + 1, py + 1, cellSize - 2, cellSize - 2);
          if (!dim) {
            ctx.fillStyle = 'rgba(255,255,255,0.25)';
            ctx.fillRect(px + 1, py + 1, cellSize - 2, 2);
            ctx.fillRect(px + 1, py + 1, 2, cellSize - 2);
          }
        }
      }
    }
  }, [type, dim, size, cellSize]);

  return (
    <canvas
      ref={canvasRef}
      width={size * cellSize}
      height={size * cellSize}
    />
  );
}
