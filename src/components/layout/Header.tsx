import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SyncIcon from "@mui/icons-material/Sync";
import TuneIcon from "@mui/icons-material/Tune";
import { AppBar, Box, Divider, IconButton, Stack, Toolbar, Tooltip, Typography, useScrollTrigger } from "@mui/material";
import React from "react";
import { useLastUpdated } from "../../hooks/useLastUpdated";

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
  onSettingsClick: () => void;
}

/**
 * Renders the header component for the application.
 *
 * @param param0 Props for the Header component.
 * @returns The header component for the application.
 */
function HeaderComponent({ onInfoClick, onSettingsClick }: HeaderProps) {
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 0 });

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

        {/* Right Side: Last Updated, Settings, Info Button */}
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <LastUpdatedDisplay />
          </Box>
          <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", sm: "block" } }} />
          <Tooltip title="Settings">
            <IconButton color="inherit" onClick={onSettingsClick}>
              <TuneIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="About">
            <IconButton color="inherit" onClick={onInfoClick}>
              <InfoOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

const Header = React.memo(HeaderComponent);
export default Header;
