import type { ThemeSetting } from "./theme";

export interface Settings {
  firstDay: number;
  sourceTimeZone: string;
  destinationTimeZone: string;
  theme: ThemeSetting;
}
