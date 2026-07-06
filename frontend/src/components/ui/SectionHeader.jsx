export const SectionHeader = ({ eyebrow, title, description, action }) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
    <div className="grid gap-1">
      {eyebrow ? <span className="text-xs font-semibold uppercase tracking-[0.28em] text-mint-500 dark:text-mint-300">{eyebrow}</span> : null}
      <h2 className="text-2xl font-semibold tracking-tight text-ink-900 dark:text-white">{title}</h2>
      {description ? <p className="max-w-3xl text-sm leading-6 text-ink-600 dark:text-ink-300">{description}</p> : null}
    </div>
    {action}
  </div>
);
