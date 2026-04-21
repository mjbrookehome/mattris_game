import { useState, useEffect } from 'react';
import { PieceType } from '../game/constants';
import { PiecePreview } from './GameBoard';

interface HoldPanelProps {
  heldPiece: PieceType | null;
  canHold: boolean;
}

export default function HoldPanel({ heldPiece, canHold }: HoldPanelProps) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) {
    return (
      <div className="flex flex-col items-center gap-0.5 p-1 bg-slate-800 rounded border border-slate-600 w-16">
        <span className="text-xs font-bold uppercase tracking-wide text-slate-400 leading-none">Hold</span>
        <div style={{ transform: 'scale(0.6)', transformOrigin: 'top center' }}>
          <PiecePreview type={heldPiece} dim={!canHold} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 p-3 bg-slate-800 rounded border border-slate-600 w-24">
      <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Hold</span>
      <PiecePreview type={heldPiece} dim={!canHold} />
    </div>
  );
}
