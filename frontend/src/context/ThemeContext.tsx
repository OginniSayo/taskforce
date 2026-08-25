import { useContext, createContext, useState, useEffect, useCallback } from "react";
import type { JSX, ReactNode } from "react";

type Theme = 'nord' | 'dim';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}

const ThemeContextProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [theme, setTheme] = useState<Theme>((): Theme => {
    const savedTheme = localStorage.getItem('task-force-theme') as Theme | null;
    if (savedTheme === 'dim' || savedTheme === 'nord') return savedTheme;

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dim' : 'nord';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('task-force-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback((): void => {
    setTheme(prev => (prev === 'nord' ? 'dim' : 'nord'));
  }, []);

  const value: ThemeContextType = {
    theme, toggleTheme,
  } 

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeContextProvider