export type ThemeMode = 'light' | 'dark';
export type ThemeSetting = ThemeMode | 'auto';

export interface Settings {
  theme: ThemeSetting;
  firstDay: number;
  timezone: string;
  hour12: boolean;
}

export interface Timezone {
  value: string;
  text: string;
}
