import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import PublicIcon from '@mui/icons-material/Public';
import SettingsBrightnessOutlinedIcon from '@mui/icons-material/SettingsBrightnessOutlined';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { dayOptions } from '../../config/eventFilter';
import { useSettingsContext } from '../../contexts/SettingsContext';
import { fetchTimezones } from '../../services/eventService';
import type { Settings, ThemeSetting, Timezone } from '../../types/settings';

const themeOptions: {
  value: ThemeSetting;
  text: string;
  Icon: React.ElementType;
}[] = [
  { value: 'light', text: 'Light', Icon: LightModeOutlinedIcon },
  { value: 'dark', text: 'Dark', Icon: DarkModeOutlinedIcon },
  { value: 'auto', text: 'Auto', Icon: SettingsBrightnessOutlinedIcon },
];

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
  onSettingsChange: (newSettings: Partial<Settings>) => void;
}

function SettingsDialogComponent({
  open,
  onClose,
  onSettingsChange,
}: SettingsDialogProps) {
  const theme = useTheme();
  const { settings } = useSettingsContext();
  const [timezones, setTimezones] = useState<Timezone[]>([
    { text: settings.timezone, value: settings.timezone },
  ]);
  const [loadingTimezones, setLoadingTimezones] = useState(true);

  useEffect(() => {
    if (open) {
      const getTimezones = async () => {
        setLoadingTimezones(true);
        try {
          const tzData = await fetchTimezones();
          const userTimezone = settings.timezone;
          const userTimezoneInList = tzData.some(
            (tz) => tz.value === userTimezone
          );

          if (!userTimezoneInList) {
            setTimezones([
              { text: userTimezone, value: userTimezone },
              ...tzData,
            ]);
          } else {
            setTimezones(tzData);
          }
        } catch (error) {
          console.error('Failed to fetch timezones:', error);
        } finally {
          setLoadingTimezones(false);
        }
      };
      getTimezones();
    }
  }, [open, settings.timezone]);

  const handleSettingChange = (
    field: keyof Settings,
    value: string | number | boolean
  ) => {
    onSettingsChange({ [field]: value });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: 'none',
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h6" component="div" fontWeight={600}>
          Settings
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={4} sx={{ pt: 1 }}>
          <Stack spacing={2}>
            <Typography variant="subtitle1" fontWeight={500}>
              Appearance
            </Typography>
            <ToggleButtonGroup
              value={settings.theme}
              exclusive
              onChange={(_, value) =>
                value && handleSettingChange('theme', value)
              }
              fullWidth
            >
              {themeOptions.map(({ value, text, Icon }) => (
                <ToggleButton
                  key={value}
                  value={value}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5,
                    textTransform: 'none',
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.divider}`,
                    '&.Mui-selected': {
                      bgcolor: 'action.selected',
                      '&:hover': {
                        bgcolor: 'action.selected',
                      },
                    },
                  }}
                >
                  <Icon fontSize="medium" />
                  {text}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="body1">Upcoming Event Tracker</Typography>
              <ToggleButtonGroup
                value={settings.showNextEvent}
                exclusive
                onChange={(_, value) => {
                  if (value !== null) {
                    handleSettingChange('showNextEvent', value);
                  }
                }}
              >
                <ToggleButton
                  value={true}
                  sx={{ textTransform: 'none', px: 2, py: 0.5 }}
                >
                  Show
                </ToggleButton>
                <ToggleButton
                  value={false}
                  sx={{ textTransform: 'none', px: 2, py: 0.5 }}
                >
                  Hide
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Stack>

          <Stack spacing={1.5}>
            <Typography variant="subtitle1" fontWeight={500}>
              Calendar Display
            </Typography>
            <FormControl fullWidth>
              <InputLabel id="first-day-select-label">
                Week Starts On
              </InputLabel>
              <Select
                labelId="first-day-select-label"
                value={settings.firstDay}
                label="Week Starts On"
                onChange={(e: SelectChangeEvent<number>) =>
                  handleSettingChange('firstDay', e.target.value)
                }
                sx={{ borderRadius: 2 }}
              >
                {dayOptions.map((day) => (
                  <MenuItem key={day.value} value={day.value}>
                    {day.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <Stack spacing={1.5}>
            <Typography variant="subtitle1" fontWeight={500}>
              Time & Date
            </Typography>
            <FormControl fullWidth>
              <InputLabel id="timezone-select-label">Time Zone</InputLabel>
              <Select
                labelId="timezone-select-label"
                value={settings.timezone}
                label="Time Zone"
                onChange={(e: SelectChangeEvent<string>) =>
                  handleSettingChange('timezone', e.target.value)
                }
                sx={{ borderRadius: 2 }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300,
                    },
                  },
                }}
                renderValue={(selectedValue) => {
                  const selectedTimezone = timezones.find(
                    (tz) => tz.value === selectedValue
                  );
                  return (
                    <Typography noWrap>
                      {selectedTimezone ? selectedTimezone.text : selectedValue}
                    </Typography>
                  );
                }}
              >
                {loadingTimezones && timezones.length === 1 && (
                  <MenuItem disabled>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <CircularProgress size={20} />
                      <Typography>Loading timezones...</Typography>
                    </Stack>
                  </MenuItem>
                )}
                {timezones.map((tz, index) => (
                  <MenuItem key={`${tz.value}-${index}`} value={tz.value}>
                    <Stack
                      direction="row"
                      spacing={1.5}
                      alignItems="center"
                      sx={{ overflow: 'hidden' }}
                    >
                      <PublicIcon
                        fontSize="small"
                        sx={{ opacity: 0.6, flexShrink: 0 }}
                      />
                      <Typography noWrap sx={{ flex: 1 }}>
                        {tz.text}
                      </Typography>
                    </Stack>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <ToggleButtonGroup
                value={settings.hour12}
                exclusive
                onChange={(_, value) => {
                  if (value !== null) {
                    handleSettingChange('hour12', value);
                  }
                }}
                fullWidth
              >
                <ToggleButton value={true} sx={{ textTransform: 'none' }}>
                  12-hour
                </ToggleButton>
                <ToggleButton value={false} sx={{ textTransform: 'none' }}>
                  24-hour
                </ToggleButton>
              </ToggleButtonGroup>
            </FormControl>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="contained" sx={{ borderRadius: 2 }}>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export const SettingsDialog = React.memo(SettingsDialogComponent);
SettingsDialog.displayName = 'SettingsDialog';
