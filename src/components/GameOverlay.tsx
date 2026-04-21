import { GameStatus } from '../store/gameStore';

interface GameOverlayProps {
  status: GameStatus;
  score: number;
  onStart: () => void;
  onRestart: () => void;
  onResume: () => void;
}

export default function GameOverlay({ status, score, onStart, onRestart, onResume }: GameOverlayProps) {
  if (status === 'playing') return null;

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded z-10"
      data-testid="game-overlay"
    >
      {status === 'idle' && (
        <>
          <h2 className="text-3xl font-bold text-white mb-2">TETRIS</h2>
          <p className="text-slate-300 mb-6 text-sm">Use keyboard to play</p>
          <button
            onClick={onStart}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded transition-colors"
            data-testid="btn-start"
          >
            Press Enter / Start
          </button>
        </>
      )}

      {status === 'paused' && (
        <>
          <h2 className="text-3xl font-bold text-white mb-6">Paused</h2>
          <button
            onClick={onResume}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded transition-colors"
            data-testid="btn-resume"
          >
            Resume (Esc)
          </button>
        </>
      )}

      {status === 'gameover' && (
        <>
          <h2 className="text-3xl font-bold text-red-400 mb-2">Game Over</h2>
          <p className="text-slate-300 mb-1 text-sm">Final Score</p>
          <p className="text-4xl font-mono font-bold text-white mb-6" data-testid="final-score">
            {score.toLocaleString()}
          </p>
          <button
            onClick={onRestart}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded transition-colors"
            data-testid="btn-play-again"
          >
            Play Again
          </button>
        </>
      )}
    </div>
  );
}
