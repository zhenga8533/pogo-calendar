import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BoltIcon from '@mui/icons-material/Bolt';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EggIcon from '@mui/icons-material/Egg';
import FilterListIcon from '@mui/icons-material/FilterList';
import GroupIcon from '@mui/icons-material/Group';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SearchIcon from '@mui/icons-material/Search';
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
  InputBase,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Popover,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  alpha,
  styled,
  useScrollTrigger,
  useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
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
import LogoIcon from '/icon.svg';

// Styled Search Component
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: 0,
  marginLeft: 0,
  width: '100%',
  flexGrow: 1, // Allow growing on mobile to fill space
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
    minWidth: '300px', // Wider search on desktop
    flexGrow: 0, // Don't grow on desktop, let spacers center it
  },
  // Adjust for light mode visibility
  ...(theme.palette.mode === 'light' && {
    backgroundColor: alpha(theme.palette.common.black, 0.05),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.black, 0.1),
    },
  }),
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}));

const NAV_ITEMS = [
  { label: 'Calendar', path: '/', icon: CalendarMonthIcon },
  { label: 'Egg Pool', path: '/egg-pool', icon: EggIcon },
  { label: 'Raid Bosses', path: '/raid-bosses', icon: BoltIcon },
  { label: 'Research', path: '/research-tasks', icon: AssignmentIcon },
  { label: 'Rocket', path: '/rocket-lineup', icon: GroupIcon },
  { label: 'FAQ', path: '/faq', icon: HelpOutlineIcon },
];

type HeaderProps = Omit<EventFilterProps, 'isMobile'> & {
  onSettingsClick: () => void;
  onRefresh: () => void;
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
    lastUpdated,
    isMobile,
    // Filter props
    activeFilterCount,
    eggPoolFilters,
    onEggPoolFilterChange,
    eggPoolActiveFilterCount,
    raidBossFilters,
    onRaidBossFilterChange,
    raidBossActiveFilterCount,
    researchTaskFilters,
    onResearchTaskFilterChange,
    researchTaskActiveFilterCount,
    rocketLineupFilters,
    onRocketLineupFilterChange,
    rocketLineupActiveFilterCount,
    ...filterProps
  } = props;

  const theme = useTheme();
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 0 });
  const location = useLocation();

  const [filterAnchorEl, setFilterAnchorEl] =
    useState<HTMLButtonElement | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navMenuAnchorEl, setNavMenuAnchorEl] = useState<HTMLElement | null>(
    null
  );

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isMobile) setDrawerOpen(true);
    else setFilterAnchorEl(event.currentTarget);
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

  // --- Search Logic ---
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    switch (location.pathname) {
      case '/':
        filterProps.onFilterChange({
          ...filterProps.filters,
          searchTerm: value,
        });
        break;
      case '/egg-pool':
        onEggPoolFilterChange?.({ ...eggPoolFilters!, pokemonSearch: value });
        break;
      case '/raid-bosses':
        onRaidBossFilterChange?.({ ...raidBossFilters!, pokemonSearch: value });
        break;
      case '/research-tasks':
        onResearchTaskFilterChange?.({
          ...researchTaskFilters!,
          taskSearch: value,
        });
        break;
      case '/rocket-lineup':
        onRocketLineupFilterChange?.({
          ...rocketLineupFilters!,
          pokemonSearch: value,
        });
        break;
    }
  };

  const getCurrentSearchValue = () => {
    switch (location.pathname) {
      case '/':
        return filterProps.filters.searchTerm;
      case '/egg-pool':
        return eggPoolFilters?.pokemonSearch || '';
      case '/raid-bosses':
        return raidBossFilters?.pokemonSearch || '';
      case '/research-tasks':
        return researchTaskFilters?.taskSearch || '';
      case '/rocket-lineup':
        return rocketLineupFilters?.pokemonSearch || '';
      default:
        return '';
    }
  };

  // --- Filter Content Logic ---
  const getFilterContent = () => {
    switch (location.pathname) {
      case '/':
        return <EventFilter {...filterProps} />;
      case '/egg-pool':
        return (
          props.onEggPoolFilterChange &&
          props.onResetEggPoolFilters && (
            <EggPoolFilter
              filters={eggPoolFilters!}
              onFilterChange={props.onEggPoolFilterChange}
              onResetFilters={props.onResetEggPoolFilters}
              availableEggTiers={props.eggPoolOptions?.eggTiers || []}
              availableRarityTiers={props.eggPoolOptions?.rarityTiers || []}
            />
          )
        );
      case '/raid-bosses':
        return (
          props.onRaidBossFilterChange &&
          props.onResetRaidBossFilters && (
            <RaidBossFilter
              filters={raidBossFilters!}
              onFilterChange={props.onRaidBossFilterChange}
              onResetFilters={props.onResetRaidBossFilters}
              availableRaidTiers={props.raidBossOptions?.raidTiers || []}
              availableTypes={props.raidBossOptions?.types || []}
            />
          )
        );
      case '/research-tasks':
        return (
          props.onResearchTaskFilterChange &&
          props.onResetResearchTaskFilters && (
            <ResearchTaskFilter
              filters={researchTaskFilters!}
              onFilterChange={props.onResearchTaskFilterChange}
              onResetFilters={props.onResetResearchTaskFilters}
              availableCategories={props.researchTaskOptions?.categories || []}
            />
          )
        );
      case '/rocket-lineup':
        return (
          props.onRocketLineupFilterChange &&
          props.onResetRocketLineupFilters && (
            <RocketLineupFilter
              filters={rocketLineupFilters!}
              onFilterChange={props.onRocketLineupFilterChange}
              onResetFilters={props.onResetRocketLineupFilters}
              availableLeaders={props.rocketLineupOptions?.leaders || []}
            />
          )
        );
      default:
        return null;
    }
  };

  const filterContent = getFilterContent();

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
            ['background-color', 'box-shadow'],
            {
              duration: theme.transitions.duration.short,
            }
          ),
        }}
      >
        <Toolbar sx={{ gap: 2 }}>
          {/* Logo Section */}
          <Stack
            component={RouterLink}
            to="/"
            direction="row"
            alignItems="center"
            sx={{ textDecoration: 'none', color: 'inherit', flexShrink: 0 }}
          >
            <Box
              component="img"
              src={LogoIcon}
              alt="Logo"
              sx={{ mr: 1, height: 32, width: 32 }}
            />
            <Typography
              variant="h6"
              component="div"
              sx={{ display: { xs: 'none', md: 'block' }, fontWeight: 700 }}
            >
              PoGo Calendar
            </Typography>
          </Stack>

          {/* Search Section with Centering Logic */}
          {location.pathname !== '/faq' ? (
            <>
              {/* Left Spacer: Pushes search to center on desktop, hidden on mobile to let search grow */}
              <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }} />

              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search..."
                  inputProps={{ 'aria-label': 'search' }}
                  value={getCurrentSearchValue()}
                  onChange={handleSearchChange}
                />
              </Search>

              {/* Right Spacer */}
              <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }} />
            </>
          ) : (
            // FAQ Page: Just use a spacer to push actions to the right
            <Box sx={{ flexGrow: 1 }} />
          )}

          {/* Actions Section */}
          <Stack direction="row" alignItems="center" spacing={isMobile ? 0 : 1}>
            {/* Last Updated (Desktop) */}
            {!isMobile && (
              <Tooltip title={`Last Updated: ${lastUpdated}`}>
                <IconButton onClick={onRefresh} color="inherit">
                  <SyncIcon />
                </IconButton>
              </Tooltip>
            )}

            {/* Divider */}
            <Divider
              orientation="vertical"
              flexItem
              sx={{ display: { xs: 'none', sm: 'block' }, mx: 1 }}
            />

            {/* Navigation Dropdown Trigger */}
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
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': { backgroundColor: 'action.hover' },
                }}
              >
                {NAV_ITEMS.find((item) => item.path === location.pathname)
                  ?.label || 'Calendar'}
              </Button>
            )}

            {/* Filters Trigger */}
            {filterContent && (
              <Tooltip title="Filters">
                <IconButton color="inherit" onClick={handleFilterClick}>
                  <Badge
                    badgeContent={getCurrentActiveFilterCount()}
                    color="primary"
                  >
                    <FilterListIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
            )}

            {/* Settings Trigger */}
            <Tooltip title="Settings">
              <IconButton color="inherit" onClick={onSettingsClick}>
                <TuneIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Navigation Menu Dropdown */}
      <Menu
        anchorEl={navMenuAnchorEl}
        open={Boolean(navMenuAnchorEl)}
        onClose={handleNavMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{ sx: { minWidth: 200, borderRadius: 3, mt: 1 } }}
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
              sx={{ py: 1.5 }}
            >
              <ListItemIcon>
                <Icon fontSize="small" />
              </ListItemIcon>
              <ListItemText primaryTypographyProps={{ fontWeight: 500 }}>
                {item.label}
              </ListItemText>
            </MenuItem>
          );
        })}
      </Menu>

      {/* Filters Drawer (Mobile) or Popover (Desktop) */}
      {isMobile ? (
        <Drawer
          anchor="bottom"
          open={drawerOpen}
          onClose={handleCloseFilter}
          PaperProps={{
            sx: { borderRadius: '20px 20px 0 0', maxHeight: '80vh' },
          }}
        >
          <Box sx={{ p: 3 }}>{filterContent}</Box>
        </Drawer>
      ) : (
        <Popover
          open={Boolean(filterAnchorEl)}
          anchorEl={filterAnchorEl}
          onClose={handleCloseFilter}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{ sx: { mt: 1, borderRadius: 3, p: 0 } }}
        >
          {filterContent}
        </Popover>
      )}
    </>
  );
}

export default React.memo(HeaderComponent);
