import { describe, it, expect } from 'vitest';
import {
  calculateLineClearScore,
  softDropPoints,
  hardDropPoints,
  calculateLevel,
} from '../../src/game/scoring';

describe('scoring', () => {
  describe('calculateLineClearScore', () => {
    it('Single = 100 × level', () => {
      const { points } = calculateLineClearScore(1, 1, false);
      expect(points).toBe(100);
    });

    it('Single scales with level', () => {
      const { points } = calculateLineClearScore(1, 3, false);
      expect(points).toBe(300);
    });

    it('Double = 300 × level', () => {
      const { points } = calculateLineClearScore(2, 1, false);
      expect(points).toBe(300);
    });

    it('Triple = 500 × level', () => {
      const { points } = calculateLineClearScore(3, 1, false);
      expect(points).toBe(500);
    });

    it('Tetris = 800 × level', () => {
      const { points } = calculateLineClearScore(4, 1, false);
      expect(points).toBe(800);
    });

    it('Tetris at level 2 = 1600', () => {
      const { points } = calculateLineClearScore(4, 2, false);
      expect(points).toBe(1600);
    });

    it('back-to-back Tetris = floor(800 × 1.5) × level', () => {
      const { points } = calculateLineClearScore(4, 1, true);
      expect(points).toBe(Math.floor(800 * 1.5) * 1);
    });

    it('back-to-back Tetris at level 2', () => {
      const { points } = calculateLineClearScore(4, 2, true);
      expect(points).toBe(Math.floor(800 * 1.5) * 2);
    });

    it('returns backToBack=true after a Tetris', () => {
      const { backToBack } = calculateLineClearScore(4, 1, false);
      expect(backToBack).toBe(true);
    });

    it('returns backToBack=false after a non-Tetris clear', () => {
      const { backToBack } = calculateLineClearScore(1, 1, true);
      expect(backToBack).toBe(false);
    });

    it('non-Tetris clear resets the back-to-back flag', () => {
      // First build b2b
      const { backToBack: b2bAfterTetris } = calculateLineClearScore(4, 1, false);
      expect(b2bAfterTetris).toBe(true);
      // Then clear a single
      const { backToBack: b2bAfterSingle } = calculateLineClearScore(1, 1, b2bAfterTetris);
      expect(b2bAfterSingle).toBe(false);
    });

    it('returns 0 points for 0 lines cleared', () => {
      const { points } = calculateLineClearScore(0, 1, false);
      expect(points).toBe(0);
    });
  });

  describe('softDropPoints', () => {
    it('returns 1 point per row', () => {
      expect(softDropPoints(1)).toBe(1);
      expect(softDropPoints(5)).toBe(5);
    });
  });

  describe('hardDropPoints', () => {
    it('returns 2 points per row', () => {
      expect(hardDropPoints(1)).toBe(2);
      expect(hardDropPoints(10)).toBe(20);
    });
  });

  describe('calculateLevel', () => {
    it('starts at level 1 with 0 lines', () => {
      expect(calculateLevel(0)).toBe(1);
    });

    it('level 2 after 10 lines', () => {
      expect(calculateLevel(10)).toBe(2);
    });

    it('level 6 after 50 lines', () => {
      expect(calculateLevel(50)).toBe(6);
    });

    it('increments by 1 every 10 lines', () => {
      for (let i = 0; i < 10; i++) {
        expect(calculateLevel(i * 10)).toBe(i + 1);
      }
    });
  });
});
