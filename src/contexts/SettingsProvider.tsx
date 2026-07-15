import { useCallback, useEffect, useMemo, useState } from 'react';
import { SETTINGS_KEY } from '../config/constants';
import type { Settings, ThemeSetting } from '../types/settings';
import { safeGetJSON, safeSetJSON } from '../utils/storageUtils';
import { SettingsContext } from './SettingsContext';

const initialSettings: Settings = {
  theme: 'auto',
  firstDay: 0,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  hour12: true,
};

function isValidTimeZone(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: value }).format();
    return true;
  } catch {
    return false;
  }
}

function loadSettings(): Settings {
  const saved = safeGetJSON<Record<string, unknown>>(SETTINGS_KEY, {});
  return {
    theme:
      saved.theme === 'light' ||
      saved.theme === 'dark' ||
      saved.theme === 'auto'
        ? saved.theme
        : initialSettings.theme,
    firstDay:
      typeof saved.firstDay === 'number' &&
      Number.isInteger(saved.firstDay) &&
      saved.firstDay >= 0 &&
      saved.firstDay <= 6
        ? saved.firstDay
        : initialSettings.firstDay,
    timezone: isValidTimeZone(saved.timezone)
      ? saved.timezone
      : initialSettings.timezone,
    hour12:
      typeof saved.hour12 === 'boolean'
        ? saved.hour12
        : initialSettings.hour12,
  };
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(loadSettings);

  useEffect(() => {
    safeSetJSON(SETTINGS_KEY, settings);
  }, [settings]);

  const changeTheme = useCallback((theme: ThemeSetting) => {
    setSettings((prev) => ({ ...prev, theme }));
  }, []);

  const value = useMemo(
    () => ({ settings, setSettings, changeTheme }),
    [settings, changeTheme]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}
