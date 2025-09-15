import { type PaletteMode, useMediaQuery } from "@mui/material";
import { useMemo } from "react";
import { getTheme } from "../theme";
import type { ThemeSetting } from "../types/theme";

/**
 * A hook that derives the MUI theme object based on the current theme setting.
 * It also accounts for the user's system preference when the setting is "auto".
 *
 * @param themeSetting The current theme setting ('light', 'dark', or 'auto').
 * @returns An object containing the calculated MUI theme.
 */
export function useAppTheme(themeSetting: ThemeSetting) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const mode: PaletteMode = useMemo(() => {
    if (themeSetting === "auto") {
      return prefersDarkMode ? "dark" : "light";
    }
    return themeSetting;
  }, [themeSetting, prefersDarkMode]);

  const theme = useMemo(() => getTheme(mode), [mode]);

  return { theme };
}
