import { type PaletteMode, useMediaQuery } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { THEME_KEY } from "../config/storage";
import { getTheme } from "../theme";
import type { ThemeSetting } from "../types/theme";

/**
 * Type representing the possible theme settings.
 *
 * @returns An object containing the current theme, theme setting, and a function to update the theme setting.
 */
export function useAppTheme() {
  const [themeSetting, setThemeSetting] = useState<ThemeSetting>(() => {
    const savedMode = localStorage.getItem(THEME_KEY) as ThemeSetting;
    return savedMode || "auto";
  });

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const mode: PaletteMode = useMemo(() => {
    if (themeSetting === "auto") {
      return prefersDarkMode ? "dark" : "light";
    }
    return themeSetting;
  }, [themeSetting, prefersDarkMode]);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, themeSetting);
  }, [themeSetting]);

  const theme = useMemo(() => getTheme(mode), [mode]);

  return { theme, themeSetting, setThemeSetting };
}
