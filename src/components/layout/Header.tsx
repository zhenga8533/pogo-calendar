import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import InfoIcon from "@mui/icons-material/Info";
import SyncIcon from "@mui/icons-material/Sync";
import TuneIcon from "@mui/icons-material/Tune";
import { AppBar, Box, Divider, IconButton, Stack, Toolbar, Tooltip, Typography, useScrollTrigger } from "@mui/material";
import React, { useCallback, useState } from "react";
import { useLastUpdated } from "../../hooks/useLastUpdated";
import type { Settings } from "../../types/settings";
import SettingsMenu from "./SettingsMenu";

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
interface HeaderProps {
  onInfoClick: () => void;
  settings: Settings;
  onSettingChange: (field: keyof Settings, value: any) => void;
}

/**
 * Renders the header component for the application.
 *
 * @param param0 Props for the Header component.
 * @returns The header component for the application.
 */
function HeaderComponent({ onInfoClick, settings, onSettingChange }: HeaderProps) {
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 0 });
  const [settingsAnchorEl, setSettingsAnchorEl] = useState<null | HTMLElement>(null);

  const handleSettingsClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setSettingsAnchorEl(event.currentTarget);
  }, []);

  const handleSettingsClose = useCallback(() => {
    setSettingsAnchorEl(null);
  }, []);

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
          <IconButton color="inherit" onClick={handleSettingsClick}>
            <TuneIcon />
          </IconButton>
          <IconButton color="inherit" onClick={onInfoClick}>
            <InfoIcon />
          </IconButton>
        </Stack>
      </Toolbar>

      {/* Settings Menu */}
      <SettingsMenu
        anchorEl={settingsAnchorEl}
        open={Boolean(settingsAnchorEl)}
        onClose={handleSettingsClose}
        settings={settings}
        onSettingChange={onSettingChange}
      />
    </AppBar>
  );
}

const Header = React.memo(HeaderComponent);
export default Header;
