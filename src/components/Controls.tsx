interface ControlsProps {
  status: string;
  onStart: () => void;
  onRestart: () => void;
  onTogglePause: () => void;
}

export default function Controls({ status, onStart, onRestart, onTogglePause }: ControlsProps) {
  return (
    <div className="hidden md:flex gap-3 mt-3 justify-center">
      {status === 'idle' || status === 'gameover' ? (
        <button
          onClick={onStart}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded transition-colors"
        >
          {status === 'gameover' ? 'Play Again' : 'Start'}
        </button>
      ) : (
        <button
          onClick={onTogglePause}
          className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white text-sm font-bold rounded transition-colors"
        >
          {status === 'paused' ? 'Resume' : 'Pause'}
        </button>
      )}
      <button
        onClick={onRestart}
        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-bold rounded transition-colors"
      >
        Restart
      </button>
    </div>
  );
}
