import {
  LINE_SCORES,
  BACK_TO_BACK_MULTIPLIER,
  SOFT_DROP_POINTS,
  HARD_DROP_POINTS,
  LINES_PER_LEVEL,
} from './constants';

export interface ScoreResult {
  points: number;
  backToBack: boolean;
}

export function calculateLineClearScore(
  linesCleared: number,
  level: number,
  wasBackToBack: boolean,
): ScoreResult {
  if (linesCleared === 0) return { points: 0, backToBack: wasBackToBack };

  const base = LINE_SCORES[linesCleared] ?? 0;
  const isTetris = linesCleared === 4;
  const applyB2B = isTetris && wasBackToBack;

  const points = applyB2B
    ? Math.floor(base * BACK_TO_BACK_MULTIPLIER) * level
    : base * level;

  // B2B flag stays true only if this was a Tetris
  const backToBack = isTetris;

  return { points, backToBack };
}

export function softDropPoints(rows: number): number {
  return rows * SOFT_DROP_POINTS;
}

export function hardDropPoints(rows: number): number {
  return rows * HARD_DROP_POINTS;
}

export function calculateLevel(totalLinesCleared: number): number {
  return Math.floor(totalLinesCleared / LINES_PER_LEVEL) + 1;
}
