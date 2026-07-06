export const Stepper = ({ steps, currentStep }) => (
  <div className="flex flex-wrap gap-3">
    {steps.map((step, index) => {
      const active = index === currentStep;
      const completed = index < currentStep;
      return (
        <div key={step} className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium ${active ? 'bg-mint-500 text-white' : completed ? 'bg-mint-50 text-mint-700 dark:bg-mint-950 dark:text-mint-100' : 'bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300'}`}>
          <span className="grid h-7 w-7 place-items-center rounded-full bg-white/20 text-xs font-bold">{index + 1}</span>
          {step}
        </div>
      );
    })}
  </div>
);
