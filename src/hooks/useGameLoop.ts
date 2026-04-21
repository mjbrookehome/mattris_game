import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';

/**
 * Drives gravity by calling `tick()` on an interval derived from the current drop speed.
 */
export function useGameLoop() {
  const status = useGameStore(s => s.status);
  const dropInterval = useGameStore(s => s.dropInterval);
  const tick = useGameStore(s => s.tick);

  const tickRef = useRef(tick);
  tickRef.current = tick;

  useEffect(() => {
    if (status !== 'playing') return;

    const id = setInterval(() => {
      tickRef.current();
    }, dropInterval);

    return () => clearInterval(id);
  }, [status, dropInterval]);
}
