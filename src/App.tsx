import { useState, useEffect } from 'react';
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

const BOARD_COLS = 10;

export default function App() {
  const [cellSize, setCellSize] = useState(() => calculateCellSize());
  
  function calculateCellSize(): number {
    if (typeof window === 'undefined') return 32;
    const width = window.innerWidth;
    
    // Desktop or large screen: use standard size
    if (width >= 1024) return 32;
    
    // Mobile: aggressive sizing to fit everything on screen
    // Max 18px on mobile to save space for controls and UI
    const availableWidth = Math.min(width - 20, 360);
    return Math.max(12, Math.floor(availableWidth / BOARD_COLS));
  }

  useEffect(() => {
    const handleResize = () => {
      setCellSize(calculateCellSize());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      <h1 className="text-lg xl:text-2xl font-bold tracking-widest text-indigo-400 mb-1 xl:mb-4 uppercase pt-1 xl:pt-2">
        Mattris
      </h1>

      {/* Desktop layout: 3 columns */}
      <div className="desktop-layout hidden xl:flex gap-3 items-start pb-4">
        {/* Left column */}
        <div className="flex flex-col gap-3">
          <HoldPanel heldPiece={heldPiece} canHold={canHold} />
        </div>

        {/* Game board */}
        <div className="relative">
          <GameBoard board={board} currentPiece={currentPiece} cellSize={32} />
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
      <div className="mobile-layout xl:hidden flex flex-col items-center gap-0.5 w-full px-1 pb-0">
        {/* Score and difficulty info - minimal */}
        <div className="flex gap-0.5 w-full justify-center">
          <div className="bg-slate-800 rounded border border-slate-600 px-1.5 py-0.5 text-center flex-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block leading-none">Score</span>
            <span className="text-xs font-bold text-indigo-300 leading-none">{score.toLocaleString()}</span>
          </div>
          <div className="bg-slate-800 rounded border border-slate-600 px-1.5 py-0.5 text-center flex-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block leading-none">Lvl</span>
            <span className="text-xs font-bold text-green-400 leading-none">{level}</span>
          </div>
          <div className="bg-slate-800 rounded border border-slate-600 px-1.5 py-0.5 text-center flex-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block leading-none">Lines</span>
            <span className="text-xs font-bold text-blue-400 leading-none">{linesCleared}</span>
          </div>
        </div>

        {/* Game board */}
        <div className="relative py-0.5">
          <GameBoard board={board} currentPiece={currentPiece} cellSize={cellSize} />
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

        {/* Start/Restart buttons - minimal */}
        <div className="flex gap-1 w-full px-1 pb-1">
          {status === 'idle' || status === 'gameover' ? (
            <button
              onClick={startGame}
              className="flex-1 px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded transition-colors"
            >
              {status === 'gameover' ? 'Play Again' : 'Start'}
            </button>
          ) : (
            <button
              onClick={togglePause}
              className="flex-1 px-2 py-1 bg-slate-600 hover:bg-slate-500 text-white text-xs font-bold rounded transition-colors"
            >
              {status === 'paused' ? 'Resume' : 'Pause'}
            </button>
          )}
          <button
            onClick={restartGame}
            className="flex-1 px-2 py-1 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded transition-colors"
          >
            Restart
          </button>
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

      <div className="mt-2 xl:mt-4 text-xs text-slate-500 space-y-0.5 text-center hidden xl:block pb-4">
        <p>← → Move &nbsp;|&nbsp; ↑ Rotate CW &nbsp;|&nbsp; Z Rotate CCW</p>
        <p>↓ Soft drop &nbsp;|&nbsp; Space Hard drop &nbsp;|&nbsp; C Hold &nbsp;|&nbsp; Esc Pause</p>
      </div>
    </div>
  );
}
