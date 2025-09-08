import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import InfoIcon from "@mui/icons-material/Info";
import SyncIcon from "@mui/icons-material/Sync";
import {
  AppBar,
  Box,
  Divider,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useScrollTrigger,
  type PaletteMode,
} from "@mui/material";
import { useLastUpdated } from "../../hooks/useLastUpdated";

/**
 * Displays the last updated time with loading and error states.
 *
 * @returns A component that displays the last updated time with loading and error states.
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
  onToggleTheme: () => void;
  onInfoClick: () => void;
  mode: PaletteMode;
}

/**
 * Header component that displays the app bar with theme toggle and info button.
 *
 * @param param0 Props including theme toggle handler, info click handler, and current theme mode.
 * @returns A component that renders the app bar with various controls.
 */
function Header({ onToggleTheme, onInfoClick, mode }: HeaderProps) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  // Render the app bar with title, last updated display, theme toggle, and info button
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
          <IconButton sx={{ ml: 1 }} onClick={onToggleTheme} color="inherit">
            {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          <IconButton color="inherit" onClick={onInfoClick}>
            <InfoIcon />
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
