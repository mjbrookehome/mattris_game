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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1280);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1280);
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

  // Responsive button sizes based on screen width - ultra compact
  const isTiny = window.innerWidth < 360;
  const isSmall = window.innerWidth < 420;
  const isMedium = window.innerWidth < 600;
  
  let buttonSize = 'w-12 h-12 text-sm';
  let hardDropHeight = 'h-10';
  let padding = 'p-2';
  let spacing = 'space-y-1';
  let gap = 'gap-1';
  
  if (isTiny) {
    buttonSize = 'w-8 h-8 text-xs';
    hardDropHeight = 'h-6';
    padding = 'p-0.5';
    spacing = 'space-y-0.5';
    gap = 'gap-0';
  } else if (isSmall) {
    buttonSize = 'w-9 h-9 text-xs';
    hardDropHeight = 'h-7';
    padding = 'p-1';
    spacing = 'space-y-0.5';
    gap = 'gap-0.5';
  } else if (isMedium) {
    buttonSize = 'w-10 h-10 text-xs';
    hardDropHeight = 'h-8';
    padding = 'p-1';
    spacing = 'space-y-1';
    gap = 'gap-0.5';
  }

  return (
    <div className="mobile-controls w-full px-0.5 pb-0.5">
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
