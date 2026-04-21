import { useState, useEffect } from 'react';

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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isMobile) {
    return null;
  }

  // Only trigger callbacks when game is playing
  const handleAction = (callback: () => void) => {
    if (isPlaying) {
      callback();
    }
  };

  const buttonClass =
    'active:scale-95 transition-transform active:opacity-70 disabled:opacity-50 disabled:cursor-not-allowed';

  // Responsive button sizes based on screen width
  const isTiny = window.innerWidth < 380;
  const isSmall = window.innerWidth < 480;
  const buttonSize = isTiny ? 'w-10 h-10 text-xs' : isSmall ? 'w-11 h-11 text-sm' : 'w-12 h-12 text-sm';
  const hardDropHeight = isTiny ? 'h-8' : isSmall ? 'h-9' : 'h-10';
  const padding = isTiny ? 'p-1' : 'p-2';
  const spacing = isTiny ? 'space-y-1' : 'space-y-2';
  const gap = isTiny ? 'gap-0.5' : 'gap-1';

  return (
    <div className="w-full px-1 pb-2">
      <div className={`bg-slate-900 border-2 border-green-400 rounded-lg ${padding} ${spacing}`}>
        {/* D-Pad for movement */}
        <div className={`flex justify-between items-center ${gap}`}>
          {/* Left side - Movement and rotation */}
          <div className={`flex ${gap}`}>
            <button
              onClick={() => handleAction(onMoveLeft)}
              disabled={!isPlaying}
              className={`${buttonSize} bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg ${buttonClass}`}
              aria-label="Move left"
            >
              ◀
            </button>
            <div className={`flex flex-col ${gap}`}>
              <button
                onClick={() => handleAction(onRotateCCW)}
                disabled={!isPlaying}
                className={`${buttonSize} bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg ${buttonClass}`}
                aria-label="Rotate counter-clockwise"
              >
                ↺
              </button>
              <button
                onClick={() => handleAction(onSoftDrop)}
                disabled={!isPlaying}
                className={`${buttonSize} bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg ${buttonClass}`}
                aria-label="Soft drop"
              >
                ▼
              </button>
            </div>
            <button
              onClick={() => handleAction(onMoveRight)}
              disabled={!isPlaying}
              className={`${buttonSize} bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg ${buttonClass}`}
              aria-label="Move right"
            >
              ▶
            </button>
          </div>

          {/* Right side - Action buttons */}
          <div className={`flex ${gap}`}>
            <button
              onClick={() => handleAction(onRotateCW)}
              disabled={!isPlaying}
              className={`${buttonSize} bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg ${buttonClass}`}
              aria-label="Rotate clockwise"
            >
              ↻
            </button>
            <button
              onClick={() => handleAction(onHold)}
              disabled={!isPlaying}
              className={`${buttonSize} bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg text-xs ${buttonClass}`}
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
          className={`w-full ${hardDropHeight} bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg text-xs ${buttonClass}`}
          aria-label="Hard drop"
        >
          DROP
        </button>
      </div>
    </div>
  );
}
