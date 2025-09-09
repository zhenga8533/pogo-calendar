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
import { useLastUpdated } from "../../hooks/useLastUpdated";
import type { ThemeSetting } from "../../types/theme";

/**
 * Displays the last updated time with loading and error states.
 *
 * @returns {React.ReactElement} A component that displays the last updated time.
 */
function LastUpdatedDisplay() {
  const { lastUpdated, loading, error } = useLastUpdated();

  // Render loading, error, or last updated time
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

interface HeaderProps {
  themeSetting: ThemeSetting;
  setThemeSetting: (setting: ThemeSetting) => void;
  onInfoClick: () => void;
}

/**
 * Header component that displays the app bar with theme selector and info button.
 *
 * @param {HeaderProps} props Props including theme setting, handler, and info click handler.
 * @returns {React.ReactElement} A component that renders the app bar with various controls.
 */
function Header({ themeSetting, setThemeSetting, onInfoClick }: HeaderProps) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  // Render the app bar with title, last updated display, theme selector, and info button
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
        <CalendarMonthIcon sx={{ mr: 1.5 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          PoGo Event Calendar
        </Typography>

        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <LastUpdatedDisplay />
          </Box>
          <Divider
            orientation="vertical"
            flexItem
            sx={{ borderColor: "inherit", my: 1.5, display: { xs: "none", sm: "block" } }}
          />
          <FormControl variant="standard" sx={{ minWidth: 50 }}>
            <Select
              value={themeSetting}
              onChange={(e) => setThemeSetting(e.target.value as ThemeSetting)}
              disableUnderline
              sx={{
                color: "inherit",
                "& .MuiSvgIcon-root": {
                  color: "inherit",
                },
                "& .MuiSelect-select": {
                  display: "flex",
                  alignItems: "center",
                },
              }}
            >
              <MenuItem value="light">
                <Stack direction="row" spacing={1} alignItems="center">
                  <LightModeIcon fontSize="small" />
                  <Typography variant="body2">Light</Typography>
                </Stack>
              </MenuItem>
              <MenuItem value="dark">
                <Stack direction="row" spacing={1} alignItems="center">
                  <DarkModeIcon fontSize="small" />
                  <Typography variant="body2">Dark</Typography>
                </Stack>
              </MenuItem>
              <MenuItem value="auto">
                <Stack direction="row" spacing={1} alignItems="center">
                  <SettingsBrightnessIcon fontSize="small" />
                  <Typography variant="body2">Auto</Typography>
                </Stack>
              </MenuItem>
            </Select>
          </FormControl>
          <IconButton color="inherit" onClick={onInfoClick}>
            <InfoIcon />
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
