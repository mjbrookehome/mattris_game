interface MobileControlsProps {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onSoftDrop: () => void;
  onHardDrop: () => void;
  onRotateCW: () => void;
  onRotateCCW: () => void;
  onHold: () => void;
  isPlaying: boolean;
}

export default function MobileControls({
  onMoveLeft,
  onMoveRight,
  onSoftDrop,
  onHardDrop,
  onRotateCW,
  onRotateCCW,
  onHold,
  isPlaying,
}: MobileControlsProps) {
  // Only trigger callbacks when game is playing
  const handleAction = (callback: () => void) => {
    if (isPlaying) {
      callback();
    }
  };

  const buttonClass =
    'active:scale-95 transition-transform active:opacity-70 disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <div className="md:hidden w-full mt-6 px-4">
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 space-y-4">
        {/* D-Pad for movement */}
        <div className="flex justify-between items-center gap-2">
          {/* Left side - Movement */}
          <div className="flex gap-2">
            <button
              onClick={() => handleAction(onMoveLeft)}
              disabled={!isPlaying}
              className={`w-14 h-14 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-lg ${buttonClass}`}
              aria-label="Move left"
            >
              ◀
            </button>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleAction(onRotateCCW)}
                disabled={!isPlaying}
                className={`w-14 h-14 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-lg ${buttonClass}`}
                aria-label="Rotate counter-clockwise"
              >
                ↺
              </button>
              <button
                onClick={() => handleAction(onSoftDrop)}
                disabled={!isPlaying}
                className={`w-14 h-14 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-lg ${buttonClass}`}
                aria-label="Soft drop"
              >
                ▼
              </button>
            </div>
            <button
              onClick={() => handleAction(onMoveRight)}
              disabled={!isPlaying}
              className={`w-14 h-14 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-lg ${buttonClass}`}
              aria-label="Move right"
            >
              ▶
            </button>
          </div>

          {/* Right side - Action buttons */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleAction(onRotateCW)}
              disabled={!isPlaying}
              className={`w-14 h-14 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg text-sm ${buttonClass}`}
              aria-label="Rotate clockwise"
            >
              ↻
            </button>
            <button
              onClick={() => handleAction(onHold)}
              disabled={!isPlaying}
              className={`w-14 h-14 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg text-xs ${buttonClass}`}
              aria-label="Hold piece"
            >
              HOLD
            </button>
          </div>
        </div>

        {/* Hard drop button - full width */}
        <button
          onClick={() => handleAction(onHardDrop)}
          disabled={!isPlaying}
          className={`w-full h-12 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg text-base ${buttonClass}`}
          aria-label="Hard drop"
        >
          HARD DROP (Space)
        </button>

        {/* Mobile instructions */}
        <div className="text-xs text-slate-400 text-center">
          <p>Use buttons to control the game</p>
        </div>
      </div>
    </div>
  );
}
