import { useState, useEffect } from 'react';
import { PieceType } from '../game/constants';
import { PiecePreview } from './GameBoard';

interface NextQueueProps {
  nextQueue: PieceType[];
}

export default function NextQueue({ nextQueue }: NextQueueProps) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) {
    return (
      <div className="flex flex-col items-center gap-0.5 p-1 bg-slate-800 rounded border border-slate-600 w-16">
        <span className="text-xs font-bold uppercase tracking-wide text-slate-400 leading-none">Next</span>
        {nextQueue.slice(0, 3).map((type, i) => (
          <div key={i} style={{ transform: 'scale(0.5)', transformOrigin: 'top center', marginBottom: '-8px' }}>
            <PiecePreview type={type} size={4} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1 p-3 bg-slate-800 rounded border border-slate-600 w-24">
      <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Next</span>
      {nextQueue.map((type, i) => (
        <PiecePreview key={i} type={type} size={4} />
      ))}
    </div>
  );
}
