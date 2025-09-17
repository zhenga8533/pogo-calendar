import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SyncIcon from "@mui/icons-material/Sync";
import TuneIcon from "@mui/icons-material/Tune";
import {
  AppBar,
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useScrollTrigger,
} from "@mui/material";
import React, { useEffect } from "react";
import { useLastUpdated } from "../../hooks/useLastUpdated";

const LastUpdatedDisplay = React.memo(
  /**
   * A memoized component that displays the last updated time with loading and error states.
   *
   * @returns A component that displays the last updated time with loading and error states.
   */
  function LastUpdatedDisplay({
    onRefresh,
    setRefetchLastUpdated,
  }: {
    onRefresh: () => void;
    setRefetchLastUpdated: (refetch: () => Promise<void>) => void;
  }) {
    const { lastUpdated, loading, error, refetch } = useLastUpdated();

    useEffect(() => {
      setRefetchLastUpdated(refetch);
    }, [refetch, setRefetchLastUpdated]);

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
      <Tooltip title="Click to refresh data">
        <Stack direction="row" alignItems="center" spacing={1} onClick={onRefresh} sx={{ cursor: "pointer" }}>
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
  onSettingsClick: () => void;
  onRefresh: () => void;
  setRefetchLastUpdated: (refetch: () => Promise<void>) => void;
  onNavigateHome: () => void;
  onNavigate: (view: "calendar" | "faq") => void;
}

/**
 * Renders the header component for the application.
 *
 * @param param0 Props for the Header component.
 * @returns The header component for the application.
 */
function HeaderComponent({
  onSettingsClick,
  onRefresh,
  setRefetchLastUpdated,
  onNavigateHome,
  onNavigate,
}: HeaderProps) {
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
        {/* App Icon and Title (Clickable) */}
        <Stack direction="row" alignItems="center" onClick={onNavigateHome} sx={{ cursor: "pointer", flexGrow: 1 }}>
          <CalendarMonthIcon sx={{ mr: 1.5 }} />
          <Typography variant="h6" component="div">
            PoGo Event Calendar
          </Typography>
        </Stack>

        {/* Right Side: Last Updated, Settings, Info Button */}
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <LastUpdatedDisplay onRefresh={onRefresh} setRefetchLastUpdated={setRefetchLastUpdated} />
          </Box>
          <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", sm: "block" } }} />
          <Button color="inherit" onClick={() => onNavigate("faq")}>
            FAQ
          </Button>
          <Tooltip title="Settings">
            <IconButton color="inherit" onClick={onSettingsClick}>
              <TuneIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

const Header = React.memo(HeaderComponent);
export default Header;
