import FilterListIcon from '@mui/icons-material/FilterList';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SyncIcon from '@mui/icons-material/Sync';
import TuneIcon from '@mui/icons-material/Tune';
import {
  AppBar,
  Badge,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Popover,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useScrollTrigger,
  useTheme,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EggIcon from '@mui/icons-material/Egg';
import BoltIcon from '@mui/icons-material/Bolt';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GroupIcon from '@mui/icons-material/Group';
import React, { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import type { CalendarEvent } from '../../types/events';
import type { EventFilterProps } from '../../types/filters';
import type {
  EggPoolFilters,
  RaidBossFilters,
  ResearchTaskFilters,
  RocketLineupFilters,
} from '../../types/pageFilters';
import EggPoolFilter from '../filters/EggPoolFilter';
import EventFilter from '../filters/EventFilter';
import RaidBossFilter from '../filters/RaidBossFilter';
import ResearchTaskFilter from '../filters/ResearchTaskFilter';
import RocketLineupFilter from '../filters/RocketLineupFilter';
import NextEventTracker from '../shared/NextEventTracker';
import LogoIcon from '/icon.svg';

const NAV_ITEMS = [
  { label: 'Calendar', path: '/', icon: CalendarMonthIcon },
  { label: 'Egg Pool', path: '/egg-pool', icon: EggIcon },
  { label: 'Raid Bosses', path: '/raid-bosses', icon: BoltIcon },
  { label: 'Research Tasks', path: '/research-tasks', icon: AssignmentIcon },
  { label: 'Team Rocket', path: '/rocket-lineup', icon: GroupIcon },
  { label: 'FAQ', path: '/faq', icon: HelpOutlineIcon },
];

const LastUpdatedDisplay = React.memo(function LastUpdatedDisplay({
  onRefresh,
  lastUpdated,
  loading,
  error,
}: {
  onRefresh: () => void;
  lastUpdated: string | null;
  loading: boolean;
  error: string | null;
}) {
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
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        onClick={onRefresh}
        sx={{ cursor: 'pointer' }}
      >
        <SyncIcon fontSize="small" />
        <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
          {lastUpdated}
        </Typography>
      </Stack>
    </Tooltip>
  );
});

type HeaderProps = Omit<EventFilterProps, 'isMobile'> & {
  onSettingsClick: () => void;
  onRefresh: () => void;
  nextUpcomingEvent: CalendarEvent | null;
  onSelectEvent: (event: CalendarEvent) => void;
  showNextEventTracker: boolean;
  lastUpdated: string | null;
  lastUpdatedLoading: boolean;
  lastUpdatedError: string | null;
  activeFilterCount: number;
  isMobile: boolean;
  // Page-specific filters
  eggPoolFilters?: EggPoolFilters;
  onEggPoolFilterChange?: (filters: EggPoolFilters) => void;
  onResetEggPoolFilters?: () => void;
  eggPoolActiveFilterCount?: number;
  eggPoolOptions?: { eggTiers: string[]; rarityTiers: string[] };
  raidBossFilters?: RaidBossFilters;
  onRaidBossFilterChange?: (filters: RaidBossFilters) => void;
  onResetRaidBossFilters?: () => void;
  raidBossActiveFilterCount?: number;
  raidBossOptions?: { raidTiers: string[]; types: string[] };
  researchTaskFilters?: ResearchTaskFilters;
  onResearchTaskFilterChange?: (filters: ResearchTaskFilters) => void;
  onResetResearchTaskFilters?: () => void;
  researchTaskActiveFilterCount?: number;
  researchTaskOptions?: { categories: string[] };
  rocketLineupFilters?: RocketLineupFilters;
  onRocketLineupFilterChange?: (filters: RocketLineupFilters) => void;
  onResetRocketLineupFilters?: () => void;
  rocketLineupActiveFilterCount?: number;
  rocketLineupOptions?: { leaders: string[] };
};

function HeaderComponent(props: HeaderProps) {
  const {
    onSettingsClick,
    onRefresh,
    nextUpcomingEvent,
    onSelectEvent,
    showNextEventTracker,
    lastUpdated,
    lastUpdatedLoading,
    lastUpdatedError,
    activeFilterCount,
    isMobile,
    eggPoolFilters,
    onEggPoolFilterChange,
    onResetEggPoolFilters,
    eggPoolActiveFilterCount,
    eggPoolOptions,
    raidBossFilters,
    onRaidBossFilterChange,
    onResetRaidBossFilters,
    raidBossActiveFilterCount,
    raidBossOptions,
    researchTaskFilters,
    onResearchTaskFilterChange,
    onResetResearchTaskFilters,
    researchTaskActiveFilterCount,
    researchTaskOptions,
    rocketLineupFilters,
    onRocketLineupFilterChange,
    onResetRocketLineupFilters,
    rocketLineupActiveFilterCount,
    rocketLineupOptions,
    ...filterProps
  } = props;
  const theme = useTheme();
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 0 });
  const location = useLocation();

  const [filterAnchorEl, setFilterAnchorEl] =
    useState<HTMLButtonElement | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navMenuAnchorEl, setNavMenuAnchorEl] = useState<HTMLElement | null>(null);

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

  const handleNavMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNavMenuAnchorEl(event.currentTarget);
  };

  const handleNavMenuClose = () => {
    setNavMenuAnchorEl(null);
  };

  // Determine which filter to render based on current route
  const getFilterContent = () => {
    switch (location.pathname) {
      case '/':
        return <EventFilter {...filterProps} />;
      case '/egg-pool':
        if (eggPoolFilters && onEggPoolFilterChange && onResetEggPoolFilters) {
          return (
            <EggPoolFilter
              filters={eggPoolFilters}
              onFilterChange={onEggPoolFilterChange}
              onResetFilters={onResetEggPoolFilters}
              availableEggTiers={eggPoolOptions?.eggTiers || []}
              availableRarityTiers={eggPoolOptions?.rarityTiers || []}
            />
          );
        }
        return null;
      case '/raid-bosses':
        if (raidBossFilters && onRaidBossFilterChange && onResetRaidBossFilters) {
          return (
            <RaidBossFilter
              filters={raidBossFilters}
              onFilterChange={onRaidBossFilterChange}
              onResetFilters={onResetRaidBossFilters}
              availableRaidTiers={raidBossOptions?.raidTiers || []}
              availableTypes={raidBossOptions?.types || []}
            />
          );
        }
        return null;
      case '/research-tasks':
        if (researchTaskFilters && onResearchTaskFilterChange && onResetResearchTaskFilters) {
          return (
            <ResearchTaskFilter
              filters={researchTaskFilters}
              onFilterChange={onResearchTaskFilterChange}
              onResetFilters={onResetResearchTaskFilters}
              availableCategories={researchTaskOptions?.categories || []}
            />
          );
        }
        return null;
      case '/rocket-lineup':
        if (rocketLineupFilters && onRocketLineupFilterChange && onResetRocketLineupFilters) {
          return (
            <RocketLineupFilter
              filters={rocketLineupFilters}
              onFilterChange={onRocketLineupFilterChange}
              onResetFilters={onResetRocketLineupFilters}
              availableLeaders={rocketLineupOptions?.leaders || []}
            />
          );
        }
        return null;
      case '/faq':
        return null; // No filters for FAQ page
      default:
        return <EventFilter {...filterProps} />;
    }
  };

  const filterContent = getFilterContent();
  const open = Boolean(filterAnchorEl);

  // Get current active filter count based on route
  const getCurrentActiveFilterCount = () => {
    switch (location.pathname) {
      case '/':
        return activeFilterCount;
      case '/egg-pool':
        return eggPoolActiveFilterCount || 0;
      case '/raid-bosses':
        return raidBossActiveFilterCount || 0;
      case '/research-tasks':
        return researchTaskActiveFilterCount || 0;
      case '/rocket-lineup':
        return rocketLineupActiveFilterCount || 0;
      default:
        return 0;
    }
  };

  const currentActiveFilterCount = getCurrentActiveFilterCount();

  return (
    <>
      <AppBar
        position="sticky"
        elevation={trigger ? 4 : 0}
        sx={{
          backgroundColor: trigger
            ? theme.palette.background.paper
            : theme.palette.mode === 'dark'
            ? 'rgba(18, 18, 18, 0.8)'
            : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(12px)',
          color: theme.palette.text.primary,
          borderBottom: `1px solid ${theme.palette.divider}`,
          transition: theme.transitions.create(
            ['background-color', 'box-shadow', 'color'],
            {
              duration: theme.transitions.duration.short,
            }
          ),
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Stack
            component={RouterLink}
            to="/"
            direction="row"
            alignItems="center"
            sx={{
              cursor: 'pointer',
              textDecoration: 'none',
              color: 'inherit',
              flexShrink: 0,
            }}
          >
            <Box
              component="img"
              src={LogoIcon}
              alt="PoGo Calendar Logo"
              sx={{
                mr: 1.5,
                height: 28,
                width: 28,
              }}
            />
            <Typography
              variant="h6"
              component="div"
              sx={{ display: { xs: 'none', sm: 'block' } }}
            >
              PoGo Event Calendar
            </Typography>
          </Stack>

          <Box sx={{ flexGrow: 1 }} />

          {showNextEventTracker && (
            <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
              <NextEventTracker
                nextEvent={nextUpcomingEvent}
                onEventClick={onSelectEvent}
              />
            </Box>
          )}

          <Box sx={{ flexGrow: 1 }} />

          <Stack direction="row" alignItems="center" spacing={isMobile ? 0 : 1}>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <LastUpdatedDisplay
                onRefresh={onRefresh}
                lastUpdated={lastUpdated}
                loading={lastUpdatedLoading}
                error={lastUpdatedError}
              />
            </Box>
            <Divider
              orientation="vertical"
              flexItem
              sx={{ display: { xs: 'none', sm: 'block' }, mx: 1 }}
            />

            {isMobile ? (
              <Tooltip title="Menu">
                <IconButton color="inherit" onClick={handleNavMenuOpen}>
                  <ArrowDropDownIcon />
                </IconButton>
              </Tooltip>
            ) : (
              <Button
                color="inherit"
                onClick={handleNavMenuOpen}
                endIcon={<ArrowDropDownIcon />}
                sx={{
                  '&:hover': { backgroundColor: 'action.hover' },
                }}
              >
                {NAV_ITEMS.find((item) => item.path === location.pathname)?.label || 'Calendar'}
              </Button>
            )}

            {filterContent && (
              <Tooltip title="Filters">
                <Badge badgeContent={currentActiveFilterCount} color="primary">
                  {isMobile ? (
                    <IconButton color="inherit" onClick={handleFilterClick}>
                      <FilterListIcon />
                    </IconButton>
                  ) : (
                    <Button
                      color="inherit"
                      startIcon={<FilterListIcon />}
                      onClick={handleFilterClick}
                      sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
                    >
                      Filters
                    </Button>
                  )}
                </Badge>
              </Tooltip>
            )}

            <Tooltip title="Settings">
              {isMobile ? (
                <IconButton color="inherit" onClick={onSettingsClick}>
                  <TuneIcon />
                </IconButton>
              ) : (
                <Button
                  color="inherit"
                  startIcon={<TuneIcon />}
                  onClick={onSettingsClick}
                  sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
                >
                  Settings
                </Button>
              )}
            </Tooltip>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Navigation Menu */}
      <Menu
        anchorEl={navMenuAnchorEl}
        open={Boolean(navMenuAnchorEl)}
        onClose={handleNavMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <MenuItem
              key={item.path}
              component={RouterLink}
              to={item.path}
              onClick={handleNavMenuClose}
              selected={location.pathname === item.path}
            >
              <ListItemIcon>
                <Icon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{item.label}</ListItemText>
            </MenuItem>
          );
        })}
      </Menu>

      {/* Filters Drawer/Popover */}
      {isMobile ? (
        <Drawer anchor="left" open={drawerOpen} onClose={handleCloseFilter}>
          <Box sx={{ width: 300, p: 2, pt: 4 }}>{filterContent}</Box>
        </Drawer>
      ) : (
        <Popover
          open={open}
          anchorEl={filterAnchorEl}
          onClose={handleCloseFilter}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          slotProps={{
            paper: { sx: { backgroundColor: 'background.default' } },
          }}
        >
          {filterContent}
        </Popover>
      )}
    </>
  );
}

const Header = React.memo(HeaderComponent);
Header.displayName = 'Header';
export default Header;
