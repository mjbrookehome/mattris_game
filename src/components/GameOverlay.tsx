import { GameStatus } from '../store/gameStore';
import { DIFFICULTIES, DIFFICULTY_LABELS, Difficulty } from '../game/constants';

interface GameOverlayProps {
  status: GameStatus;
  score: number;
  difficulty: Difficulty;
  onStart: () => void;
  onRestart: () => void;
  onResume: () => void;
  onSetDifficulty: (d: Difficulty) => void;
}

export default function GameOverlay({ status, score, difficulty, onStart, onRestart, onResume, onSetDifficulty }: GameOverlayProps) {
  if (status === 'playing') return null;

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded z-10"
      data-testid="game-overlay"
    >
      {status === 'idle' && (
        <>
          <h2 className="text-3xl font-bold text-white mb-2">MATTRIS</h2>
          <p className="text-slate-300 mb-4 text-sm">Use keyboard to play</p>
          
          <div className="mb-6 space-y-2">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Select Difficulty</p>
            <div className="flex gap-2 flex-wrap justify-center max-w-xs">
              {DIFFICULTIES.map(d => (
                <button
                  key={d}
                  onClick={() => onSetDifficulty(d)}
                  className={`px-3 py-1 text-sm font-bold rounded transition-all ${
                    difficulty === d
                      ? 'bg-indigo-600 text-white ring-2 ring-indigo-400'
                      : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                  }`}
                  data-testid={`difficulty-${d.toLowerCase()}`}
                >
                  {DIFFICULTY_LABELS[d]}
                </button>
              ))}
            </div>
          </div>

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
