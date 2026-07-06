import { forwardRef } from 'react';

const base = 'w-full rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 shadow-sm transition focus:border-mint-400 focus:outline-none focus:ring-2 focus:ring-mint-200 dark:border-ink-700 dark:bg-ink-900 dark:text-white';

export const Select = forwardRef(function Select({ className = '', label, children, error, id, ...props }, ref) {
  const selectId = id || props.name;
  return (
    <label className="grid gap-2" htmlFor={selectId}>
      {label ? <span className="text-sm font-medium text-ink-700 dark:text-ink-200">{label}</span> : null}
      <select ref={ref} id={selectId} className={`${base} ${className}`} {...props}>
        {children}
      </select>
      {error ? <span className="text-xs font-medium text-red-500">{error}</span> : null}
    </label>
  );
});
