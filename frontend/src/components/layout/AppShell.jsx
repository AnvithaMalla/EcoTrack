import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useTheme } from '../../hooks/useTheme';
import { useOffline } from '../../hooks/useOffline';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { FiLogOut } from 'react-icons/fi';

export const AppShell = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const isOffline = useOffline();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-hero-grid text-ink-900 dark:bg-ink-950 dark:text-white">
      <div className="flex min-h-screen">
        <Sidebar onLogout={logout} />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar user={user} theme={theme} setTheme={setTheme} isOffline={isOffline} onMenu={() => setMobileOpen(true)} />
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </div>
      <AnimatePresence>
        {mobileOpen ? (
          <motion.div className="fixed inset-0 z-50 bg-ink-950/60 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="h-full w-[84%] max-w-xs bg-white p-5 dark:bg-ink-950" initial={{ x: -40 }} animate={{ x: 0 }} exit={{ x: -40 }}>
              <Sidebar onLogout={logout} mobile />
              <Button variant="ghost" className="mt-4 w-full justify-center" onClick={() => setMobileOpen(false)}>
                <FiLogOut /> Close
              </Button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};
