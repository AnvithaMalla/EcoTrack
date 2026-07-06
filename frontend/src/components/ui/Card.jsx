export const Card = ({ className = '', children, ...props }) => (
  <section className={`rounded-3xl border border-white/60 bg-white/80 p-5 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-ink-900/70 ${className}`} {...props}>
    {children}
  </section>
);
