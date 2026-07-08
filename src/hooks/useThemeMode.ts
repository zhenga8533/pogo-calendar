import { useEffect, useState } from 'react';
import type { ThemeMode, ThemeSetting } from '../types/settings';

function resolveMode(setting: ThemeSetting, prefersDark: boolean): ThemeMode {
  if (setting === 'auto') return prefersDark ? 'dark' : 'light';
  return setting;
}

function usePrefersDark(): boolean {
  const [prefersDark, setPrefersDark] = useState(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (e: MediaQueryListEvent) => setPrefersDark(e.matches);
    mql.addEventListener('change', listener);
    return () => mql.removeEventListener('change', listener);
  }, []);

  return prefersDark;
}

/** Resolves 'auto' against system preference without touching the DOM. */
export function useResolvedThemeMode(setting: ThemeSetting): ThemeMode {
  const prefersDark = usePrefersDark();
  return resolveMode(setting, prefersDark);
}

/** Resolves the theme mode and applies the `dark` class to <html>. */
export function useThemeMode(setting: ThemeSetting): ThemeMode {
  const mode = useResolvedThemeMode(setting);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark');
  }, [mode]);

  return mode;
}
