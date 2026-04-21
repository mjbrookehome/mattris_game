interface ScorePanelProps {
  score: number;
  highScore: number;
  level: number;
  linesCleared: number;
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{label}</span>
      <span className="text-xl font-mono font-bold text-white" data-testid={`stat-${label.toLowerCase().replace(' ', '-')}`}>
        {value.toLocaleString()}
      </span>
    </div>
  );
}

export default function ScorePanel({ score, highScore, level, linesCleared }: ScorePanelProps) {
  return (
    <div className="flex flex-col gap-4 p-3 bg-slate-800 rounded border border-slate-600 w-24">
      <Stat label="Score" value={score} />
      <Stat label="Best" value={highScore} />
      <Stat label="Level" value={level} />
      <Stat label="Lines" value={linesCleared} />
    </div>
  );
}
