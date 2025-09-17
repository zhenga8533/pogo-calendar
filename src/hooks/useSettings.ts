import { type PaletteMode, useMediaQuery } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { SETTINGS_KEY } from "../config/storage";
import { getTheme } from "../theme";
import type { Settings } from "../types/settings";

const initialSettings: Settings = {
  theme: "auto",
  firstDay: 0,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  hour12: true,
};

/**
 * Custom hook to manage user settings with localStorage persistence.
 *
 * @returns An object containing the current theme, settings, and a function to update the settings.
 */
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

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const mode: PaletteMode = useMemo(() => {
    if (settings.theme === "auto") {
      return prefersDarkMode ? "dark" : "light";
    }
    return settings.theme;
  }, [settings.theme, prefersDarkMode]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const theme = useMemo(() => getTheme(mode), [mode]);

  return { theme, settings, setSettings };
}
