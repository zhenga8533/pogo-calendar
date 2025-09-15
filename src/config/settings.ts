import type { Settings } from "../types/settings";

export const initialSettings: Settings = {
  firstDay: 0,
  sourceTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  destinationTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  theme: "auto",
};

export const timeZoneOptions = Intl.supportedValuesOf("timeZone");
