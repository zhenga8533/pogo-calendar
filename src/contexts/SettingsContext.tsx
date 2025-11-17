import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { SETTINGS_KEY } from '../config/constants';
import type { Settings, ThemeSetting } from '../types/settings';
import { safeGetJSON, safeSetJSON } from '../utils/storageUtils';

interface SettingsContextType {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  changeTheme: (theme: ThemeSetting) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

const initialSettings: Settings = {
  theme: 'auto',
  firstDay: 0,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  hour12: true,
  showNextEvent: true,
};

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = safeGetJSON<Partial<Settings>>(SETTINGS_KEY, {});
    return { ...initialSettings, ...saved };
  });

  useEffect(() => {
    safeSetJSON(SETTINGS_KEY, settings);
  }, [settings]);

  const changeTheme = (theme: ThemeSetting) => {
    setSettings((prev) => ({ ...prev, theme }));
  };

  const value = useMemo(
    () => ({ settings, setSettings, changeTheme }),
    [settings]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettingsContext() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error(
      'useSettingsContext must be used within a SettingsProvider'
    );
  }
  return context;
}
