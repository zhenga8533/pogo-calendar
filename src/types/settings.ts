import type { PaletteMode } from "@mui/material";

export type ThemeSetting = PaletteMode | "auto";

export interface Settings {
  theme: ThemeSetting;
  firstDay: number;
  timezone: string;
  hour12: boolean;
  showNextEvent: boolean;
}

export interface Timezone {
  value: string;
  text: string;
}
