import { create } from 'zustand';
import { Board, createBoard, isValidPosition, lockPiece, clearLines, getGhostY } from '../game/board';
import { Piece, spawnPiece } from '../game/tetrominoes';
import { rotatePiece } from '../game/rotation';
import { createBag, drawFromBag, fillQueue } from '../game/bag';
import {
  calculateLineClearScore,
  softDropPoints,
  hardDropPoints,
  calculateLevel,
} from '../game/scoring';
import {
  PieceType,
  NEXT_QUEUE_SIZE,
  getDropInterval,
  LOCAL_STORAGE_HIGH_SCORE_KEY,
  Difficulty,
  DIFFICULTY_MULTIPLIERS,
} from '../game/constants';

export type GameStatus = 'idle' | 'playing' | 'paused' | 'gameover';

export interface GameState {
  board: Board;
  currentPiece: Piece | null;
  heldPiece: PieceType | null;
  canHold: boolean;
  nextQueue: PieceType[];
  bag: PieceType[];
  score: number;
  highScore: number;
  level: number;
  linesCleared: number;
  status: GameStatus;
  backToBack: boolean;
  dropInterval: number;
  difficulty: Difficulty;

  // Actions
  startGame: () => void;
  restartGame: () => void;
  togglePause: () => void;
  setDifficulty: (d: Difficulty) => void;
  moveLeft: () => void;
  moveRight: () => void;
  softDrop: () => void;
  hardDrop: () => void;
  rotateCW: () => void;
  rotateCCW: () => void;
  holdPiece: () => void;
  tick: () => void;
  _lockCurrentPiece: () => void;
}

function loadHighScore(): number {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_HIGH_SCORE_KEY);
    return stored ? parseInt(stored, 10) : 0;
  } catch {
    return 0;
  }
}

function saveHighScore(score: number): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_HIGH_SCORE_KEY, String(score));
  } catch {
    // ignore
  }
}

function getDifficultyAdjustedInterval(linesCleared: number, difficulty: Difficulty): number {
  const baseInterval = getDropInterval(linesCleared);
  const multiplier = DIFFICULTY_MULTIPLIERS[difficulty];
  return Math.round(baseInterval * multiplier);
}

function buildInitialData() {
  const bag = createBag();
  const { queue, bag: remainingBag } = fillQueue([], bag, NEXT_QUEUE_SIZE + 1);
  const nextQueue = queue.slice(0, NEXT_QUEUE_SIZE);
  const firstType = queue[NEXT_QUEUE_SIZE];

  return {
    board: createBoard(),
    currentPiece: spawnPiece(firstType),
    heldPiece: null as PieceType | null,
    canHold: true,
    nextQueue,
    bag: remainingBag,
    score: 0,
    highScore: loadHighScore(),
    level: 1,
    linesCleared: 0,
    status: 'idle' as GameStatus,
    backToBack: false,
    difficulty: 'Normal' as Difficulty,
    dropInterval: getDifficultyAdjustedInterval(0, 'Normal'),
  };
}

export const useGameStore = create<GameState>((set, get) => ({
  ...buildInitialData(),

  startGame() {
    const bag = createBag();
    const { queue, bag: remainingBag } = fillQueue([], bag, NEXT_QUEUE_SIZE + 1);
    const nextQueue = queue.slice(0, NEXT_QUEUE_SIZE);
    const firstType = queue[NEXT_QUEUE_SIZE];
    const { difficulty } = get();

    set({
      board: createBoard(),
      currentPiece: spawnPiece(firstType),
      heldPiece: null,
      canHold: true,
      nextQueue,
      bag: remainingBag,
      score: 0,
      level: 1,
      linesCleared: 0,
      status: 'playing',
      backToBack: false,
      dropInterval: getDifficultyAdjustedInterval(0, difficulty),
    });
  },

  setDifficulty(d: Difficulty) {
    const { status } = get();
    if (status === 'idle') {
      set({ difficulty: d });
    }
  },

  restartGame() {
    get().startGame();
  },

  togglePause() {
    const { status } = get();
    if (status === 'playing') set({ status: 'paused' });
    else if (status === 'paused') set({ status: 'playing' });
  },

  moveLeft() {
    const { currentPiece, board, status } = get();
    if (status !== 'playing' || !currentPiece) return;
    const moved = { ...currentPiece, x: currentPiece.x - 1 };
    if (isValidPosition(board, moved)) set({ currentPiece: moved });
  },

  moveRight() {
    const { currentPiece, board, status } = get();
    if (status !== 'playing' || !currentPiece) return;
    const moved = { ...currentPiece, x: currentPiece.x + 1 };
    if (isValidPosition(board, moved)) set({ currentPiece: moved });
  },

  softDrop() {
    const { currentPiece, board, status, score } = get();
    if (status !== 'playing' || !currentPiece) return;
    const moved = { ...currentPiece, y: currentPiece.y + 1 };
    if (isValidPosition(board, moved)) {
      set({ currentPiece: moved, score: score + softDropPoints(1) });
    } else {
      get()._lockCurrentPiece();
    }
  },

  hardDrop() {
    const { currentPiece, board, status, score } = get();
    if (status !== 'playing' || !currentPiece) return;
    const ghostY = getGhostY(board, currentPiece);
    const dropped = ghostY - currentPiece.y;
    const landed = { ...currentPiece, y: ghostY };
    set({ currentPiece: landed, score: score + hardDropPoints(dropped) });
    get()._lockCurrentPiece();
  },

  rotateCW() {
    const { currentPiece, board, status } = get();
    if (status !== 'playing' || !currentPiece) return;
    const rotated = rotatePiece(board, currentPiece, true);
    if (rotated) set({ currentPiece: rotated });
  },

  rotateCCW() {
    const { currentPiece, board, status } = get();
    if (status !== 'playing' || !currentPiece) return;
    const rotated = rotatePiece(board, currentPiece, false);
    if (rotated) set({ currentPiece: rotated });
  },

  holdPiece() {
    const { currentPiece, heldPiece, canHold, nextQueue, bag, status } = get();
    if (status !== 'playing' || !currentPiece || !canHold) return;

    let nextPieceType: PieceType;
    let newQueue = [...nextQueue];
    let newBag = [...bag];

    if (heldPiece) {
      nextPieceType = heldPiece;
    } else {
      nextPieceType = newQueue.shift()!;
      const { type, bag: updatedBag } = drawFromBag(newBag);
      newQueue.push(type);
      newBag = updatedBag;
    }

    set({
      heldPiece: currentPiece.type,
      currentPiece: spawnPiece(nextPieceType),
      nextQueue: newQueue,
      bag: newBag,
      canHold: false,
    });
  },

  tick() {
    const { currentPiece, board, status } = get();
    if (status !== 'playing' || !currentPiece) return;
    const moved = { ...currentPiece, y: currentPiece.y + 1 };
    if (isValidPosition(board, moved)) {
      set({ currentPiece: moved });
    } else {
      get()._lockCurrentPiece();
    }
  },

  // Internal helper – not exposed on the type directly but added at runtime
  _lockCurrentPiece() {
    const { currentPiece, board, nextQueue, bag, score, linesCleared, backToBack, level, difficulty } = get();
    if (!currentPiece) return;

    const newBoard = lockPiece(board, currentPiece);
    const { board: clearedBoard, linesCleared: newLines } = clearLines(newBoard);

    const { points, backToBack: newB2B } = calculateLineClearScore(newLines, level, backToBack);
    const totalLines = linesCleared + newLines;
    const newLevel = calculateLevel(totalLines);
    const newScore = score + points;
    const newHighScore = Math.max(newScore, loadHighScore());
    if (newScore > loadHighScore()) saveHighScore(newScore);

    // Draw next piece
    const newQueue = [...nextQueue];
    const nextType = newQueue.shift()!;
    const { type: queued, bag: updatedBag } = drawFromBag([...bag]);
    newQueue.push(queued);

    const nextPiece = spawnPiece(nextType);
    const isGameOver = !isValidPosition(clearedBoard, nextPiece);

    set({
      board: clearedBoard,
      currentPiece: isGameOver ? null : nextPiece,
      nextQueue: newQueue,
      bag: updatedBag,
      score: newScore,
      highScore: newHighScore,
      linesCleared: totalLines,
      level: newLevel,
      backToBack: newB2B,
      canHold: true,
      dropInterval: getDifficultyAdjustedInterval(totalLines, difficulty),
      status: isGameOver ? 'gameover' : 'playing',
    });
  },
} as GameState));
