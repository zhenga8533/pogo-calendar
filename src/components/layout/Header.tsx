import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import InfoIcon from "@mui/icons-material/Info";
import LightModeIcon from "@mui/icons-material/LightMode";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
import SyncIcon from "@mui/icons-material/Sync";
import {
  AppBar,
  Box,
  Divider,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useScrollTrigger,
} from "@mui/material";
import React, { useCallback } from "react";
import { useLastUpdated } from "../../hooks/useLastUpdated";
import type { ThemeSetting } from "../../types/theme";

const themeOptions = [
  { value: "light", text: "Light", Icon: LightModeIcon },
  { value: "dark", text: "Dark", Icon: DarkModeIcon },
  { value: "auto", text: "Auto", Icon: SettingsBrightnessIcon },
];

const LastUpdatedDisplay = React.memo(
  /**
   * A memoized component that displays the last updated time with loading and error states.
   *
   * @returns A component that displays the last updated time with loading and error states.
   */
  function LastUpdatedDisplay() {
    const { lastUpdated, loading, error } = useLastUpdated();

    // Render loading, error, or last updated time based on state.
    if (loading) {
      return (
        <Typography variant="body2" sx={{ opacity: 0.7 }}>
          Checking for updates...
        </Typography>
      );
    }
    if (error) {
      return (
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      );
    }

    // Render the last updated time with an icon and tooltip.
    return (
      <Tooltip title="Last Data Refresh">
        <Stack direction="row" alignItems="center" spacing={1}>
          <SyncIcon fontSize="small" />
          <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
            {lastUpdated}
          </Typography>
        </Stack>
      </Tooltip>
    );
  }
);

const ThemeSelector = React.memo(
  /**
   * A memoized component that provides a theme selection dropdown.
   *
   * @param param0 Props for the ThemeSelector component.
   * @returns A selector for choosing the application theme.
   */
  function ThemeSelector({ themeSetting, onChange }: { themeSetting: ThemeSetting; onChange: (e: any) => void }) {
    return (
      <FormControl variant="standard" sx={{ minWidth: 50 }}>
        <Select
          value={themeSetting}
          onChange={onChange}
          disableUnderline
          sx={{
            color: "inherit",
            "& .MuiSvgIcon-root": { color: "inherit" },
            "& .MuiSelect-select": { display: "flex", alignItems: "center" },
          }}
        >
          {themeOptions.map(({ value, text, Icon }) => (
            <MenuItem key={value} value={value}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Icon fontSize="small" />
                <Typography variant="body2">{text}</Typography>
              </Stack>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }
);
interface HeaderProps {
  themeSetting: ThemeSetting;
  setThemeSetting: (setting: ThemeSetting) => void;
  onInfoClick: () => void;
}

/**
 * Renders the header component for the application.
 *
 * @param param0 Props for the Header component.
 * @returns The header component for the application.
 */
function HeaderComponent({ themeSetting, setThemeSetting, onInfoClick }: HeaderProps) {
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 0 });

  const handleThemeChange = useCallback(
    (e: React.ChangeEvent<{ value: unknown }>) => {
      setThemeSetting(e.target.value as ThemeSetting);
    },
    [setThemeSetting]
  );

  // Render the AppBar with dynamic styles based on scroll position.
  return (
    <AppBar
      position="sticky"
      elevation={trigger ? 4 : 0}
      sx={(theme) => ({
        backgroundColor: trigger
          ? theme.palette.background.paper
          : theme.palette.mode === "dark"
          ? "rgba(18, 18, 18, 0.8)"
          : "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(8px)",
        color: theme.palette.text.primary,
        transition: theme.transitions.create(["background-color", "box-shadow", "color"], {
          duration: theme.transitions.duration.short,
        }),
      })}
    >
      <Toolbar>
        {/* App Icon and Title */}
        <CalendarMonthIcon sx={{ mr: 1.5 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          PoGo Event Calendar
        </Typography>

        {/* Right Side: Last Updated, Theme Selector, Info Button */}
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <LastUpdatedDisplay />
          </Box>
          <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", sm: "block" } }} />
          <ThemeSelector themeSetting={themeSetting} onChange={handleThemeChange} />
          <IconButton color="inherit" onClick={onInfoClick}>
            <InfoIcon />
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

const Header = React.memo(HeaderComponent);
export default Header;
