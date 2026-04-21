// Board dimensions (includes 2-row hidden buffer at top)
export const BOARD_COLS = 10;
export const BOARD_ROWS = 22; // 20 visible + 2 buffer
export const VISIBLE_ROWS = 20;
export const BUFFER_ROWS = 2;
export const CELL_SIZE = 32; // px

// Next queue size
export const NEXT_QUEUE_SIZE = 5;

// Lock delay
export const LOCK_DELAY_MS = 500;
export const MAX_LOCK_RESETS = 15;

// Gravity intervals (ms) keyed by minimum line threshold
export const GRAVITY_TABLE: [number, number][] = [
  [50, 100],
  [40, 250],
  [30, 370],
  [20, 500],
  [10, 650],
  [0, 800],
];

export function getDropInterval(linesCleared: number): number {
  for (const [threshold, interval] of GRAVITY_TABLE) {
    if (linesCleared >= threshold) return interval;
  }
  return 800;
}

// Piece colours
export const PIECE_COLORS: Record<string, string> = {
  I: '#00f0f0',
  O: '#f0f000',
  T: '#a000f0',
  S: '#00f000',
  Z: '#f00000',
  J: '#0000f0',
  L: '#f0a000',
  ghost: 'rgba(255,255,255,0.15)',
  empty: '#1e293b',
  locked: '',
};

export const PIECE_TYPES = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'] as const;
export type PieceType = (typeof PIECE_TYPES)[number];

// Scoring
export const LINE_SCORES: Record<number, number> = {
  1: 100,
  2: 300,
  3: 500,
  4: 800,
};

export const BACK_TO_BACK_MULTIPLIER = 1.5;
export const SOFT_DROP_POINTS = 1;
export const HARD_DROP_POINTS = 2;

export const LINES_PER_LEVEL = 10;

export const LOCAL_STORAGE_HIGH_SCORE_KEY = 'tetris_highscore';
