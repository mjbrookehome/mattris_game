import { PieceType } from '../game/constants';
import { PiecePreview } from './GameBoard';

interface NextQueueProps {
  nextQueue: PieceType[];
}

export default function NextQueue({ nextQueue }: NextQueueProps) {
  return (
    <div className="flex flex-col items-center gap-1 p-3 bg-slate-800 rounded border border-slate-600 w-24">
      <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Next</span>
      {nextQueue.map((type, i) => (
        <PiecePreview key={i} type={type} size={4} />
      ))}
    </div>
  );
}
