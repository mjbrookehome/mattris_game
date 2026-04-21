import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

export function useKeyboard() {
  const startGame = useGameStore(s => s.startGame);
  const togglePause = useGameStore(s => s.togglePause);
  const moveLeft = useGameStore(s => s.moveLeft);
  const moveRight = useGameStore(s => s.moveRight);
  const softDrop = useGameStore(s => s.softDrop);
  const hardDrop = useGameStore(s => s.hardDrop);
  const rotateCW = useGameStore(s => s.rotateCW);
  const rotateCCW = useGameStore(s => s.rotateCCW);
  const holdPiece = useGameStore(s => s.holdPiece);
  const status = useGameStore(s => s.status);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Prevent arrow keys from scrolling the page during play
      const playKeys = ['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', 'Space'];
      if (playKeys.includes(e.code)) e.preventDefault();

      if (status === 'idle' || status === 'gameover') {
        if (e.code === 'Enter' || e.code === 'Space') startGame();
        return;
      }

      if (e.code === 'Escape' || e.code === 'KeyP') {
        togglePause();
        return;
      }

      if (status !== 'playing') return;

      switch (e.code) {
        case 'ArrowLeft':
        case 'KeyA':
          moveLeft();
          break;
        case 'ArrowRight':
        case 'KeyD':
          moveRight();
          break;
        case 'ArrowDown':
        case 'KeyS':
          softDrop();
          break;
        case 'Space':
          hardDrop();
          break;
        case 'ArrowUp':
        case 'KeyW':
        case 'KeyX':
          rotateCW();
          break;
        case 'KeyZ':
          rotateCCW();
          break;
        case 'KeyC':
        case 'ShiftLeft':
        case 'ShiftRight':
          holdPiece();
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, startGame, togglePause, moveLeft, moveRight, softDrop, hardDrop, rotateCW, rotateCCW, holdPiece]);
}
