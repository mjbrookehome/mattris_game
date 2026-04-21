import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MobileControls from '../../src/components/MobileControls';

describe('MobileControls', () => {
  const mockHandlers = {
    onMoveLeft: vi.fn(),
    onMoveRight: vi.fn(),
    onSoftDrop: vi.fn(),
    onHardDrop: vi.fn(),
    onRotateCW: vi.fn(),
    onRotateCCW: vi.fn(),
    onHold: vi.fn(),
  };

  it('renders mobile controls', () => {
    render(
      <MobileControls
        {...mockHandlers}
        isPlaying={true}
      />
    );

    expect(screen.getByLabelText('Move left')).toBeInTheDocument();
    expect(screen.getByLabelText('Move right')).toBeInTheDocument();
    expect(screen.getByLabelText('Soft drop')).toBeInTheDocument();
    expect(screen.getByLabelText('Hard drop')).toBeInTheDocument();
    expect(screen.getByLabelText('Rotate clockwise')).toBeInTheDocument();
    expect(screen.getByLabelText('Rotate counter-clockwise')).toBeInTheDocument();
    expect(screen.getByLabelText('Hold piece')).toBeInTheDocument();
  });

  it('calls handlers when buttons are clicked while playing', async () => {
    const user = userEvent.setup();
    render(
      <MobileControls
        {...mockHandlers}
        isPlaying={true}
      />
    );

    await user.click(screen.getByLabelText('Move left'));
    expect(mockHandlers.onMoveLeft).toHaveBeenCalled();

    await user.click(screen.getByLabelText('Move right'));
    expect(mockHandlers.onMoveRight).toHaveBeenCalled();

    await user.click(screen.getByLabelText('Soft drop'));
    expect(mockHandlers.onSoftDrop).toHaveBeenCalled();

    await user.click(screen.getByLabelText('Hard drop'));
    expect(mockHandlers.onHardDrop).toHaveBeenCalled();

    await user.click(screen.getByLabelText('Rotate clockwise'));
    expect(mockHandlers.onRotateCW).toHaveBeenCalled();

    await user.click(screen.getByLabelText('Rotate counter-clockwise'));
    expect(mockHandlers.onRotateCCW).toHaveBeenCalled();

    await user.click(screen.getByLabelText('Hold piece'));
    expect(mockHandlers.onHold).toHaveBeenCalled();
  });

  it('disables buttons when not playing', () => {
    render(
      <MobileControls
        {...mockHandlers}
        isPlaying={false}
      />
    );

    expect(screen.getByLabelText('Move left')).toBeDisabled();
    expect(screen.getByLabelText('Move right')).toBeDisabled();
    expect(screen.getByLabelText('Soft drop')).toBeDisabled();
    expect(screen.getByLabelText('Hard drop')).toBeDisabled();
    expect(screen.getByLabelText('Rotate clockwise')).toBeDisabled();
    expect(screen.getByLabelText('Rotate counter-clockwise')).toBeDisabled();
    expect(screen.getByLabelText('Hold piece')).toBeDisabled();
  });
});
