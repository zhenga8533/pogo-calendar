import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { SETTINGS_KEY } from "../config/constants";
import type { Settings, ThemeSetting } from "../types/settings";

interface SettingsContextType {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  changeTheme: (theme: ThemeSetting) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const initialSettings: Settings = {
  theme: "auto",
  firstDay: 0,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  hour12: true,
  showNextEvent: true,
};

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) {
        return { ...initialSettings, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.error("Failed to parse settings from localStorage:", error);
    }
    return initialSettings;
  });

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const changeTheme = (theme: ThemeSetting) => {
    setSettings((prev) => ({ ...prev, theme }));
  };

  const value = useMemo(() => ({ settings, setSettings, changeTheme }), [settings]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettingsContext() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettingsContext must be used within a SettingsProvider");
  }
  return context;
}
