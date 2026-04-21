import { useGameStore } from './store/gameStore';
import { useGameLoop } from './hooks/useGameLoop';
import { useKeyboard } from './hooks/useKeyboard';
import GameBoard from './components/GameBoard';
import HoldPanel from './components/HoldPanel';
import NextQueue from './components/NextQueue';
import ScorePanel from './components/ScorePanel';
import GameOverlay from './components/GameOverlay';
import Controls from './components/Controls';

export default function App() {
  const board = useGameStore(s => s.board);
  const currentPiece = useGameStore(s => s.currentPiece);
  const heldPiece = useGameStore(s => s.heldPiece);
  const canHold = useGameStore(s => s.canHold);
  const nextQueue = useGameStore(s => s.nextQueue);
  const score = useGameStore(s => s.score);
  const highScore = useGameStore(s => s.highScore);
  const level = useGameStore(s => s.level);
  const linesCleared = useGameStore(s => s.linesCleared);
  const status = useGameStore(s => s.status);
  const startGame = useGameStore(s => s.startGame);
  const restartGame = useGameStore(s => s.restartGame);
  const togglePause = useGameStore(s => s.togglePause);

  useGameLoop();
  useKeyboard();

  return (
    <div className="flex flex-col items-center select-none">
      <h1 className="text-2xl font-bold tracking-widest text-indigo-400 mb-4 uppercase">
        Tetris
      </h1>

      <div className="flex gap-3 items-start">
        {/* Left column */}
        <div className="flex flex-col gap-3">
          <HoldPanel heldPiece={heldPiece} canHold={canHold} />
        </div>

        {/* Game board */}
        <div className="relative">
          <GameBoard board={board} currentPiece={currentPiece} />
          <GameOverlay
            status={status}
            score={score}
            onStart={startGame}
            onRestart={restartGame}
            onResume={togglePause}
          />
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-3">
          <ScorePanel
            score={score}
            highScore={highScore}
            level={level}
            linesCleared={linesCleared}
          />
          <NextQueue nextQueue={nextQueue} />
        </div>
      </div>

      <Controls
        status={status}
        onStart={startGame}
        onRestart={restartGame}
        onTogglePause={togglePause}
      />

      <div className="mt-4 text-xs text-slate-500 space-y-0.5 text-center">
        <p>← → Move &nbsp;|&nbsp; ↑ Rotate CW &nbsp;|&nbsp; Z Rotate CCW</p>
        <p>↓ Soft drop &nbsp;|&nbsp; Space Hard drop &nbsp;|&nbsp; C Hold &nbsp;|&nbsp; Esc Pause</p>
      </div>
    </div>
  );
}
