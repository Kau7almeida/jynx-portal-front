export function ProgressBar({ value, max = 100, tone = 'brand', className = '', height = 8, showLabel = false }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const tones = {
    brand:   'bg-brand-500',
    success: 'bg-success',
    warning: 'bg-[#F59E0B]',
    danger:  'bg-[#EF4444]',
  };
  return (
    <div className={className}>
      <div className="w-full bg-ink-100 rounded-full overflow-hidden" style={{ height }}>
        <div
          className={`${tones[tone]} h-full rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && <div className="mt-1 text-xs text-ink-500 num">{Math.round(pct)}%</div>}
    </div>
  );
}
