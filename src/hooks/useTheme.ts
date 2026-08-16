import { useState, useEffect, useCallback } from 'react';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'bsgs-theme';
const LIGHT_CLASS = 'light-theme';
const DATA_ATTR = 'data-theme';

function getInitialTheme(): Theme {
  // 1. Respect saved preference
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    // localStorage unavailable
  }
  // 2. Respect system preference
  if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
  return 'dark';
}

function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  if (theme === 'light') {
    root.setAttribute(DATA_ATTR, 'light');
    root.classList.add(LIGHT_CLASS);
    root.classList.remove('dark-theme');
  } else {
    root.setAttribute(DATA_ATTR, 'dark');
    root.classList.remove(LIGHT_CLASS);
    root.classList.add('dark-theme');
  }
}

export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(() => {
    // Apply synchronously before first paint to avoid flash
    const initial = getInitialTheme();
    applyTheme(initial);
    return initial;
  });

  useEffect(() => {
    applyTheme(theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // localStorage unavailable
    }
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  return [theme, toggle];
}
