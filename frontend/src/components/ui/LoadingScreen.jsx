export const LoadingScreen = ({ label = 'Loading EcoTrack' }) => (
  <div className="grid min-h-[60vh] place-items-center">
    <div className="grid gap-4 text-center">
      <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-mint-500 border-t-transparent" />
      <div className="text-sm font-medium text-ink-500 dark:text-ink-300">{label}</div>
    </div>
  </div>
);
