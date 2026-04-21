import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ScorePanel from '../../src/components/ScorePanel';

describe('ScorePanel', () => {
  it('renders score, level, and lines values correctly', () => {
    render(<ScorePanel score={1200} highScore={5000} level={3} linesCleared={25} />);
    expect(screen.getByTestId('stat-score')).toHaveTextContent('1,200');
    expect(screen.getByTestId('stat-level')).toHaveTextContent('3');
    expect(screen.getByTestId('stat-lines')).toHaveTextContent('25');
    expect(screen.getByTestId('stat-best')).toHaveTextContent('5,000');
  });

  it('updates when props change', () => {
    const { rerender } = render(<ScorePanel score={0} highScore={0} level={1} linesCleared={0} />);
    expect(screen.getByTestId('stat-score')).toHaveTextContent('0');

    rerender(<ScorePanel score={800} highScore={800} level={2} linesCleared={10} />);
    expect(screen.getByTestId('stat-score')).toHaveTextContent('800');
    expect(screen.getByTestId('stat-level')).toHaveTextContent('2');
    expect(screen.getByTestId('stat-lines')).toHaveTextContent('10');
  });
});
