import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import ScheduleIcon from "@mui/icons-material/Schedule";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
import {
  Box,
  Divider,
  FormControl,
  InputLabel,
  ListItemText,
  Menu,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import { dayOptions } from "../../config/eventFilter";
import { timeZoneOptions } from "../../config/settings";
import type { Settings } from "../../types/settings";
import type { ThemeSetting } from "../../types/theme";

interface SettingsMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  settings: Settings;
  onSettingChange: (field: keyof Settings, value: any) => void;
}

const themeOptions = [
  { value: "light", text: "Light", Icon: LightModeIcon },
  { value: "dark", text: "Dark", Icon: DarkModeIcon },
  { value: "auto", text: "Auto", Icon: SettingsBrightnessIcon },
];

function SettingsMenu({ anchorEl, open, onClose, settings, onSettingChange }: SettingsMenuProps) {
  const handleThemeChange = (event: any) => {
    onSettingChange("theme", event.target.value as ThemeSetting);
  };

  const handleTimeZoneChange = (field: "sourceTimeZone" | "destinationTimeZone", value: string) => {
    if (field === "sourceTimeZone") {
      onSettingChange("sourceTimeZone", value);
      onSettingChange("destinationTimeZone", value);
    } else {
      onSettingChange("destinationTimeZone", value);
    }
  };

  return (
    <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
      <Box sx={{ p: 2, width: 300 }}>
        <Typography variant="h6" gutterBottom>
          Settings
        </Typography>
        <Divider sx={{ mt: 1, mb: 2 }} />
        <Stack spacing={2}>
          <Typography variant="subtitle2" color="text.secondary">
            Display Preferences
          </Typography>
          <FormControl fullWidth>
            <InputLabel>Theme</InputLabel>
            <Select value={settings.theme} label="Theme" onChange={handleThemeChange}>
              {themeOptions.map(({ value, text, Icon }) => (
                <MenuItem key={value} value={value}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Icon fontSize="small" />
                    <ListItemText primary={text} />
                  </Stack>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Start Day of Week</InputLabel>
            <Select
              value={settings.firstDay}
              label="Start Day of Week"
              onChange={(e) => onSettingChange("firstDay", e.target.value)}
            >
              {dayOptions.map((day) => (
                <MenuItem key={day.value} value={day.value}>
                  {day.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" color="text.secondary">
            Time Zone Settings
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <ScheduleIcon fontSize="small" color="action" />
            <FormControl fullWidth size="small">
              <InputLabel>Your Time Zone</InputLabel>
              <Select
                value={settings.sourceTimeZone}
                label="Your Time Zone"
                onChange={(e) => handleTimeZoneChange("sourceTimeZone", e.target.value as string)}
              >
                {timeZoneOptions.map((tz) => (
                  <MenuItem key={tz.value} value={tz.value}>
                    {tz.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <ScheduleIcon fontSize="small" color="action" />
            <FormControl fullWidth size="small">
              <InputLabel>View Event Times In</InputLabel>
              <Select
                value={settings.destinationTimeZone}
                label="View Event Times In"
                onChange={(e) => handleTimeZoneChange("destinationTimeZone", e.target.value as string)}
              >
                {timeZoneOptions.map((tz) => (
                  <MenuItem key={tz.value} value={tz.value}>
                    {tz.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Stack>
      </Box>
    </Menu>
  );
}

export default React.memo(SettingsMenu);
