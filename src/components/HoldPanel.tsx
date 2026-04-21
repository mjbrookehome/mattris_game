import { PieceType } from '../game/constants';
import { PiecePreview } from './GameBoard';

interface HoldPanelProps {
  heldPiece: PieceType | null;
  canHold: boolean;
}

export default function HoldPanel({ heldPiece, canHold }: HoldPanelProps) {
  return (
    <div className="flex flex-col items-center gap-2 p-3 bg-slate-800 rounded border border-slate-600 w-24">
      <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Hold</span>
      <PiecePreview type={heldPiece} dim={!canHold} />
    </div>
  );
}
