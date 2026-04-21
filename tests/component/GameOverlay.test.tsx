import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GameOverlay from '../../src/components/GameOverlay';

const noop = vi.fn();

describe('GameOverlay', () => {
  it('shows "Press Enter / Start" when status is idle', () => {
    render(<GameOverlay status="idle" score={0} onStart={noop} onRestart={noop} onResume={noop} />);
    expect(screen.getByTestId('game-overlay')).toBeInTheDocument();
    expect(screen.getByTestId('btn-start')).toBeInTheDocument();
  });

  it('shows "Paused" overlay when status is paused', () => {
    render(<GameOverlay status="paused" score={0} onStart={noop} onRestart={noop} onResume={noop} />);
    expect(screen.getByText(/paused/i)).toBeInTheDocument();
    expect(screen.getByTestId('btn-resume')).toBeInTheDocument();
  });

  it('shows final score and Play Again button when status is gameover', () => {
    render(<GameOverlay status="gameover" score={1500} onStart={noop} onRestart={noop} onResume={noop} />);
    expect(screen.getByTestId('final-score')).toHaveTextContent('1,500');
    expect(screen.getByTestId('btn-play-again')).toBeInTheDocument();
  });

  it('calls onRestart when Play Again is clicked', async () => {
    const onRestart = vi.fn();
    render(<GameOverlay status="gameover" score={0} onStart={noop} onRestart={onRestart} onResume={noop} />);
    await userEvent.click(screen.getByTestId('btn-play-again'));
    expect(onRestart).toHaveBeenCalledOnce();
  });

  it('renders nothing when status is playing', () => {
    const { container } = render(
      <GameOverlay status="playing" score={0} onStart={noop} onRestart={noop} onResume={noop} />,
    );
    expect(container.firstChild).toBeNull();
  });
});
