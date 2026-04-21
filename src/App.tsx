import { useGameStore } from './store/gameStore';
import { DIFFICULTY_LABELS } from './game/constants';
import { useGameLoop } from './hooks/useGameLoop';
import { useKeyboard } from './hooks/useKeyboard';
import GameBoard from './components/GameBoard';
import HoldPanel from './components/HoldPanel';
import NextQueue from './components/NextQueue';
import ScorePanel from './components/ScorePanel';
import GameOverlay from './components/GameOverlay';
import Controls from './components/Controls';
import MobileControls from './components/MobileControls';

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
  const difficulty = useGameStore(s => s.difficulty);
  const startGame = useGameStore(s => s.startGame);
  const restartGame = useGameStore(s => s.restartGame);
  const togglePause = useGameStore(s => s.togglePause);
  const setDifficulty = useGameStore(s => s.setDifficulty);
  const moveLeft = useGameStore(s => s.moveLeft);
  const moveRight = useGameStore(s => s.moveRight);
  const softDrop = useGameStore(s => s.softDrop);
  const hardDrop = useGameStore(s => s.hardDrop);
  const rotateCW = useGameStore(s => s.rotateCW);
  const rotateCCW = useGameStore(s => s.rotateCCW);
  const holdPiece = useGameStore(s => s.holdPiece);

  useGameLoop();
  useKeyboard();

  return (
    <div className="flex flex-col items-center select-none w-full min-h-screen bg-slate-950 overflow-x-hidden">
      <h1 className="text-xl md:text-2xl font-bold tracking-widest text-indigo-400 mb-2 md:mb-4 uppercase pt-2">
        Mattris
      </h1>

      {/* Desktop layout: 3 columns */}
      <div className="hidden md:flex gap-3 items-start pb-4">
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
            difficulty={difficulty}
            onStart={startGame}
            onRestart={restartGame}
            onResume={togglePause}
            onSetDifficulty={setDifficulty}
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
          <div className="p-3 bg-slate-800 rounded border border-slate-600 w-24 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-1">Difficulty</span>
            <span className="text-sm font-bold text-indigo-300">{DIFFICULTY_LABELS[difficulty]}</span>
          </div>
          <NextQueue nextQueue={nextQueue} />
        </div>
      </div>

      {/* Mobile layout: stacked vertical */}
      <div className="md:hidden flex flex-col items-center gap-2 w-full px-2 pb-2">
        {/* Score and difficulty info */}
        <div className="flex gap-2 w-full justify-center">
          <div className="bg-slate-800 rounded border border-slate-600 px-3 py-2 text-center min-w-20">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block">Score</span>
            <span className="text-sm font-bold text-indigo-300">{score.toLocaleString()}</span>
          </div>
          <div className="bg-slate-800 rounded border border-slate-600 px-3 py-2 text-center min-w-20">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block">Level</span>
            <span className="text-sm font-bold text-green-400">{level}</span>
          </div>
          <div className="bg-slate-800 rounded border border-slate-600 px-3 py-2 text-center min-w-20">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block">Lines</span>
            <span className="text-sm font-bold text-blue-400">{linesCleared}</span>
          </div>
        </div>

        {/* Game board */}
        <div className="relative">
          <GameBoard board={board} currentPiece={currentPiece} />
          <GameOverlay
            status={status}
            score={score}
            difficulty={difficulty}
            onStart={startGame}
            onRestart={restartGame}
            onResume={togglePause}
            onSetDifficulty={setDifficulty}
          />
        </div>

        {/* Hold and Next - side by side or stacked if space tight */}
        <div className="flex gap-2 w-full justify-center max-w-sm">
          <div className="flex-shrink-0">
            <HoldPanel heldPiece={heldPiece} canHold={canHold} />
          </div>
          <div className="flex-shrink-0">
            <NextQueue nextQueue={nextQueue} />
          </div>
        </div>
      </div>

      <Controls
        status={status}
        onStart={startGame}
        onRestart={restartGame}
        onTogglePause={togglePause}
      />

      <MobileControls
        onMoveLeft={moveLeft}
        onMoveRight={moveRight}
        onSoftDrop={softDrop}
        onHardDrop={hardDrop}
        onRotateCW={rotateCW}
        onRotateCCW={rotateCCW}
        onHold={holdPiece}
        isPlaying={status === 'playing'}
      />

      <div className="mt-2 md:mt-4 text-xs text-slate-500 space-y-0.5 text-center hidden md:block pb-4">
        <p>← → Move &nbsp;|&nbsp; ↑ Rotate CW &nbsp;|&nbsp; Z Rotate CCW</p>
        <p>↓ Soft drop &nbsp;|&nbsp; Space Hard drop &nbsp;|&nbsp; C Hold &nbsp;|&nbsp; Esc Pause</p>
      </div>
    </div>
  );
}
