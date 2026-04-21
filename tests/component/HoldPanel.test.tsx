import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HoldPanel from '../../src/components/HoldPanel';

// Mock canvas since jsdom doesn't implement it
HTMLCanvasElement.prototype.getContext = () => null;

describe('HoldPanel', () => {
  it('shows "Hold" label', () => {
    render(<HoldPanel heldPiece={null} canHold={true} />);
    expect(screen.getByText(/hold/i)).toBeInTheDocument();
  });

  it('renders without crashing when no piece is held', () => {
    const { container } = render(<HoldPanel heldPiece={null} canHold={true} />);
    expect(container).toBeInTheDocument();
  });

  it('renders without crashing when a piece is held', () => {
    const { container } = render(<HoldPanel heldPiece="T" canHold={true} />);
    expect(container).toBeInTheDocument();
  });

  it('renders the canvas element for piece display', () => {
    const { container } = render(<HoldPanel heldPiece="I" canHold={true} />);
    expect(container.querySelector('canvas')).toBeInTheDocument();
  });

  it('renders a canvas even when canHold is false (dim state)', () => {
    const { container } = render(<HoldPanel heldPiece="L" canHold={false} />);
    expect(container.querySelector('canvas')).toBeInTheDocument();
  });
});
