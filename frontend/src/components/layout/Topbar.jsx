import { FiMenu, FiMoon, FiSun, FiWifiOff } from 'react-icons/fi';
import { Button } from '../ui/Button';

export const Topbar = ({ user, theme, setTheme, isOffline, onMenu }) => {
  const nextTheme = theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark';
  return (
    <header className="sticky top-0 z-30 border-b border-white/50 bg-white/70 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-ink-950/70 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <Button variant="ghost" className="lg:hidden" onClick={onMenu} aria-label="Open menu">
          <FiMenu />
        </Button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="truncate text-lg font-semibold text-ink-900 dark:text-white">EcoTrack</h1>
            {isOffline ? <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 dark:bg-red-950 dark:text-red-100"><FiWifiOff /> Offline</span> : null}
          </div>
          <p className="truncate text-sm text-ink-500 dark:text-ink-300">Welcome back{user?.displayName ? `, ${user.displayName}` : ''}</p>
        </div>
        <Button variant="secondary" onClick={() => setTheme(nextTheme)} aria-label="Toggle theme">
          {theme === 'dark' ? <FiSun /> : <FiMoon />} Theme
        </Button>
      </div>
    </header>
  );
};
