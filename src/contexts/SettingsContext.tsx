import { useCallback, useEffect, useMemo, useState } from 'react';
import { SETTINGS_KEY } from '../config/constants';
import type { Settings, ThemeSetting } from '../types/settings';
import { safeGetJSON, safeSetJSON } from '../utils/storageUtils';
import { SettingsContext } from './settingsContextValue';

const initialSettings: Settings = {
  theme: 'auto',
  firstDay: 0,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  hour12: true,
};

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = safeGetJSON<Partial<Settings>>(SETTINGS_KEY, {});
    // Merge saved settings with initial to ensure new fields (if any) are present
    // and removed fields (like showNextEvent) don't persist if we don't want them to
    // Although for safeGetJSON, we usually just cast.
    // To cleaner remove the old key from local storage,
    // the useEffect below will handle saving the "clean" version on next render.
    return { ...initialSettings, ...saved };
  });

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
