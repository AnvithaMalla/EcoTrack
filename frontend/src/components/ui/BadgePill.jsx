export const BadgePill = ({ children, tone = 'mint', className = '' }) => {
  const tones = {
    mint: 'bg-mint-50 text-mint-700 dark:bg-mint-950 dark:text-mint-100',
    sand: 'bg-sand-50 text-sand-700 dark:bg-sand-950 dark:text-sand-100',
    ink: 'bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-100',
    red: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-100',
  };
  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${tones[tone]} ${className}`}>{children}</span>;
};
