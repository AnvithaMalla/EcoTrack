export const ProgressBar = ({ value = 0, tone = 'mint', label }) => {
  const color = {
    mint: 'bg-mint-500',
    sand: 'bg-sand-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
    ink: 'bg-ink-500',
  }[tone];
  return (
    <div className="grid gap-2">
      {label ? <div className="flex items-center justify-between text-xs font-medium text-ink-500 dark:text-ink-300"><span>{label}</span><span>{Math.round(value)}%</span></div> : null}
      <div className="h-2 overflow-hidden rounded-full bg-ink-100 dark:bg-ink-800">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
      </div>
    </div>
  );
};
