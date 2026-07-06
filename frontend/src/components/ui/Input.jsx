import { forwardRef } from 'react';

const base =
'w-full rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 shadow-sm transition placeholder:text-gray-400 placeholder:italic focus:border-mint-400 focus:outline-none focus:ring-2 focus:ring-mint-200 dark:border-ink-700 dark:bg-ink-900 dark:text-white dark:placeholder:text-gray-500';

export const Input = forwardRef(function Input({ className = '', label, error, helperText, id, ...props }, ref) {
  const inputId = id || props.name;
  return (
    <label className="grid gap-2" htmlFor={inputId}>
      {label ? <span className="text-sm font-medium text-ink-700 dark:text-ink-200">{label}</span> : null}
      <input ref={ref} id={inputId} className={`${base} ${className}`} {...props} />
      {helperText ? <span className="text-xs text-ink-500 dark:text-ink-300">{helperText}</span> : null}
      {error ? <span className="text-xs font-medium text-red-500">{error}</span> : null}
    </label>
  );
});
