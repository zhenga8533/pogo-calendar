import {
  Calendar as CalendarIcon,
  ChevronDown,
  Clipboard,
  Egg,
  Filter,
  HelpCircle,
  RefreshCw,
  Ship,
  Sliders,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import React, { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import type { EventFilterProps } from '../../types/filters';
import type {
  EggPoolFilters,
  RaidBossFilters,
  ResearchTaskFilters,
  RocketLineupFilters,
} from '../../types/pageFilters';
import { cn } from '../../lib/utils';
import { useScrollTrigger } from '../../hooks/useScrollTrigger';
import EggPoolFilter from '../filters/EggPoolFilter';
import EventFilter from '../filters/EventFilter';
import RaidBossFilter from '../filters/RaidBossFilter';
import ResearchTaskFilter from '../filters/ResearchTaskFilter';
import RocketLineupFilter from '../filters/RocketLineupFilter';
import { IconButton } from '../ui/icon-button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Sheet, SheetBody, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';
import LogoIcon from '/icon.svg';

const NAV_ITEMS: { label: string; path: string; icon: LucideIcon }[] = [
  { label: 'Calendar', path: '/', icon: CalendarIcon },
  { label: 'Egg Pool', path: '/egg-pool', icon: Egg },
  { label: 'Raid Bosses', path: '/raid-bosses', icon: Zap },
  { label: 'Research', path: '/research-tasks', icon: Clipboard },
  { label: 'Rocket', path: '/rocket-lineup', icon: Ship },
  { label: 'FAQ', path: '/faq', icon: HelpCircle },
];

type HeaderProps = Omit<EventFilterProps, 'isMobile'> & {
  onSettingsClick: () => void;
  onRefresh: () => void;
  lastUpdated: string | null;
  lastUpdatedLoading: boolean;
  lastUpdatedError: string | null;
  activeFilterCount: number;
  isMobile: boolean;
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
    lastUpdatedLoading,
    lastUpdatedError,
    isMobile,
    activeFilterCount,
    eggPoolFilters,
    eggPoolActiveFilterCount,
    raidBossFilters,
    raidBossActiveFilterCount,
    researchTaskFilters,
    researchTaskActiveFilterCount,
    rocketLineupFilters,
    rocketLineupActiveFilterCount,
    ...filterProps
  } = props;

  const trigger = useScrollTrigger(0);
  const location = useLocation();
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  const handleFilterOpenChange = (open: boolean) => {
    setFilterSheetOpen(open);
  };

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

  const filterCount = getCurrentActiveFilterCount();
  const currentNavLabel = NAV_ITEMS.find((item) => item.path === location.pathname)?.label || 'Calendar';

  const filterTriggerButton = (
    <div className="relative">
      <IconButton onClick={() => handleFilterOpenChange(true)} aria-label="Search & filters">
        <Filter />
      </IconButton>
      {filterCount > 0 && (
        <span className="pointer-events-none absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[0.65rem] font-bold text-primary-foreground">
          {filterCount}
        </span>
      )}
    </div>
  );

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b border-border backdrop-blur-md transition-colors duration-200',
        trigger ? 'bg-card shadow-soft-sm' : 'bg-card/80'
      )}
    >
      <div className="flex h-16 w-full items-center gap-2 px-3 sm:px-4 md:gap-3 md:px-6">
        <RouterLink
          to="/"
          className="flex shrink-0 items-center gap-2 text-inherit no-underline"
        >
          <img src={LogoIcon} alt="Logo" className="h-8 w-8" />
          <span className="hidden text-lg font-bold tracking-tight md:block">
            PoGo Calendar
          </span>
        </RouterLink>

        <nav className="ml-2 hidden shrink-0 items-center gap-0.5 lg:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = item.path === location.pathname;
            return (
              <RouterLink
                key={item.path}
                to={item.path}
                className={cn(
                  'rounded-full px-3 py-1.5 text-sm font-semibold text-muted-foreground no-underline transition-colors duration-150 hover:bg-accent hover:text-foreground',
                  isActive && 'bg-accent text-primary'
                )}
              >
                {item.label}
              </RouterLink>
            );
          })}
        </nav>

        <div className="flex-1" />

        <div className="flex shrink-0 items-center gap-1">
          {!isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              className="hidden text-muted-foreground md:inline-flex"
              title={lastUpdatedError ? lastUpdatedError : lastUpdatedLoading ? 'Refreshing…' : 'Refresh data'}
            >
              <RefreshCw className={cn(lastUpdatedLoading && 'animate-spin')} />
              <span className="hidden lg:inline">
                {lastUpdatedError ? 'Update failed' : lastUpdatedLoading ? 'Updating…' : `Updated ${lastUpdated}`}
              </span>
            </Button>
          )}

          <div className="mx-1 hidden h-6 w-px bg-border md:block" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {isMobile ? (
                <IconButton aria-label="Menu">
                  <ChevronDown />
                </IconButton>
              ) : (
                <Button variant="ghost" className="lg:hidden">
                  {currentNavLabel}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[200px]">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <DropdownMenuItem key={item.path} asChild>
                    <RouterLink to={item.path} className="no-underline text-inherit">
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </RouterLink>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          {filterContent &&
            <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
              <SheetTrigger asChild>{filterTriggerButton}</SheetTrigger>
              <SheetContent side="right" className="max-w-md">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <IconButton onClick={() => setFilterSheetOpen(false)} aria-label="Close filters">
                    <X className="h-4 w-4" />
                  </IconButton>
                </SheetHeader>
                <SheetBody>{filterContent}</SheetBody>
              </SheetContent>
            </Sheet>}

          <IconButton onClick={onSettingsClick} aria-label="Settings">
            <Sliders />
          </IconButton>
        </div>
      </div>
    </header>
  );
}

export default React.memo(HeaderComponent);
