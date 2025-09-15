import { useCallback, useEffect, useState } from "react";
import { initialSettings } from "../config/settings";
import { SETTINGS_KEY } from "../config/storage";
import type { Settings } from "../types/settings";

export function useSettings() {
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

  const handleSettingChange = useCallback((field: keyof Settings, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  }, []);

  return { settings, handleSettingChange };
}
