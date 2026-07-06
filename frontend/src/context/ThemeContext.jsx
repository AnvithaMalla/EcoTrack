import { createContext, useEffect, useMemo, useState } from 'react';

export const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('ecotrack-theme') || 'system');

  useEffect(() => {
    const root = document.documentElement;
    const resolved = theme === 'system' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : theme;
    root.dataset.theme = resolved;
    root.classList.toggle('dark', resolved === 'dark');
    localStorage.setItem('ecotrack-theme', theme);
  }, [theme]);

  const value = useMemo(() => ({ theme, setTheme }), [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
