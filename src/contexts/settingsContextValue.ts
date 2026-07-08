import { createContext, type Dispatch, type SetStateAction } from 'react';
import type { Settings, ThemeSetting } from '../types/settings';

export interface SettingsContextType {
  settings: Settings;
  setSettings: Dispatch<SetStateAction<Settings>>;
  changeTheme: (theme: ThemeSetting) => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);
