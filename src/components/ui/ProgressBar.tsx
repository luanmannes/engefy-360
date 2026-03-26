interface ProgressBarProps {
  value: number
  max: number
  accent?: 'gold' | 'steel'
  showLabel?: boolean
}

export default function ProgressBar({ value, max, accent = 'gold', showLabel }: ProgressBarProps) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0

  return (
    <div>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="font-head text-[11px] font-bold uppercase tracking-[0.15em] text-text-muted">
            Progresso
          </span>
          <span className={`font-head text-xs font-bold ${accent === 'gold' ? 'text-gold' : 'text-steel-light'}`}>
            {value} / {max}
          </span>
        </div>
      )}
      <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            accent === 'gold' ? 'bg-gold' : 'bg-steel'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
