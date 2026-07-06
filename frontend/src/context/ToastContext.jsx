import { createContext, useCallback, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const pushToast = useCallback((message, type = 'success') => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, message, type }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 4000);
  }, []);

  const value = useMemo(() => ({ pushToast }), [pushToast]);
  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-50 grid gap-3 sm:right-6 sm:top-6">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 24, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 24, scale: 0.95 }}
              className={`pointer-events-auto rounded-2xl border px-4 py-3 shadow-xl backdrop-blur-xl ${toast.type === 'error' ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/80 dark:text-red-100' : 'border-mint-200 bg-mint-50 text-mint-700 dark:border-mint-900/60 dark:bg-mint-950/80 dark:text-mint-100'}`}
            >
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
