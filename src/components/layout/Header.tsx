import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FilterListIcon from "@mui/icons-material/FilterList";
import SyncIcon from "@mui/icons-material/Sync";
import TuneIcon from "@mui/icons-material/Tune";
import {
  AppBar,
  Badge,
  Box,
  Button,
  Divider,
  Drawer,
  Popover,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useScrollTrigger,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useLastUpdated } from "../../hooks/useLastUpdated";
import type { CalendarEvent } from "../../types/events";
import type { EventFilterProps } from "../../types/filters";
import EventFilter from "../filters/EventFilter";
import NextEventTracker from "../shared/NextEventTracker";

const LastUpdatedDisplay = React.memo(function LastUpdatedDisplay({
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

  if (loading)
    return (
      <Typography variant="body2" sx={{ opacity: 0.7 }}>
        Checking for updates...
      </Typography>
    );
  if (error)
    return (
      <Typography variant="body2" color="error">
        {error}
      </Typography>
    );

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
});

type HeaderProps = Omit<EventFilterProps, "isMobile"> & {
  onSettingsClick: () => void;
  onRefresh: () => void;
  setRefetchLastUpdated: (refetch: () => Promise<void>) => void;
  nextUpcomingEvent: CalendarEvent | null;
  onSelectEvent: (event: CalendarEvent) => void;
  showNextEventTracker: boolean;
};

function HeaderComponent(props: HeaderProps) {
  const {
    onSettingsClick,
    onRefresh,
    setRefetchLastUpdated,
    nextUpcomingEvent,
    onSelectEvent,
    showNextEventTracker,
    ...filterProps
  } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 0 });

  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isMobile) {
      setDrawerOpen(true);
    } else {
      setFilterAnchorEl(event.currentTarget);
    }
  };

  const handleCloseFilter = () => {
    setFilterAnchorEl(null);
    setDrawerOpen(false);
  };

  const filterContent = <EventFilter {...filterProps} isMobile={isMobile} />;
  const open = Boolean(filterAnchorEl);

  const activeFilterCount =
    (props.filters.searchTerm ? 1 : 0) +
    props.filters.selectedCategories.length +
    (props.filters.startDate ? 1 : 0) +
    (props.filters.endDate ? 1 : 0) +
    (props.filters.showActiveOnly ? 1 : 0) +
    (props.filters.timeRange[0] > 0 || props.filters.timeRange[1] < 24 ? 1 : 0);

  return (
    <>
      <AppBar
        position="sticky"
        elevation={trigger ? 4 : 0}
        sx={{
          backgroundColor: trigger
            ? theme.palette.background.paper
            : theme.palette.mode === "dark"
            ? "rgba(18, 18, 18, 0.8)"
            : "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(12px)",
          color: theme.palette.text.primary,
          borderBottom: `1px solid ${theme.palette.divider}`,
          transition: theme.transitions.create(["background-color", "box-shadow", "color"], {
            duration: theme.transitions.duration.short,
          }),
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Stack
            component={RouterLink}
            to="/"
            direction="row"
            alignItems="center"
            sx={{ cursor: "pointer", textDecoration: "none", color: "inherit", flexShrink: 0 }}
          >
            <CalendarMonthIcon sx={{ mr: 1.5 }} />
            <Typography variant="h6" component="div">
              PoGo Event Calendar
            </Typography>
          </Stack>

          {showNextEventTracker && (
            <Box sx={{ display: { xs: "none", lg: "block" } }}>
              <NextEventTracker nextEvent={nextUpcomingEvent} onEventClick={onSelectEvent} />
            </Box>
          )}

          <Stack direction="row" alignItems="center" spacing={1}>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <LastUpdatedDisplay onRefresh={onRefresh} setRefetchLastUpdated={setRefetchLastUpdated} />
            </Box>
            <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", sm: "block" }, mx: 1 }} />
            <Button
              component={RouterLink}
              to="/faq"
              color="inherit"
              sx={{ "&:hover": { backgroundColor: "action.hover" } }}
            >
              FAQ
            </Button>
            <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", sm: "block" }, mx: 1 }} />
            <Tooltip title="Filters">
              <Badge badgeContent={activeFilterCount} color="primary">
                <Button
                  color="inherit"
                  startIcon={<FilterListIcon />}
                  onClick={handleFilterClick}
                  sx={{ "&:hover": { backgroundColor: "action.hover" } }}
                >
                  Filters
                </Button>
              </Badge>
            </Tooltip>
            <Tooltip title="Filters">
              <Badge badgeContent={activeFilterCount} color="primary">
                <Button
                  color="inherit"
                  startIcon={<TuneIcon />}
                  onClick={onSettingsClick}
                  sx={{ "&:hover": { backgroundColor: "action.hover" } }}
                >
                  Settings
                </Button>
              </Badge>
            </Tooltip>
          </Stack>
        </Toolbar>
      </AppBar>

      {isMobile ? (
        <Drawer anchor="left" open={drawerOpen} onClose={handleCloseFilter}>
          <Box sx={{ width: 300, p: 2, pt: 4 }}>{filterContent}</Box>
        </Drawer>
      ) : (
        <Popover
          open={open}
          anchorEl={filterAnchorEl}
          onClose={handleCloseFilter}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          slotProps={{ paper: { sx: { backgroundColor: "background.default" } } }}
        >
          {filterContent}
        </Popover>
      )}
    </>
  );
}

const Header = React.memo(HeaderComponent);
export default Header;
