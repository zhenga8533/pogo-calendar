import { lazy, Suspense, useCallback, useMemo, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import CreateEventDialog from './components/events/CreateEventDialog';
import { ExportEventDialog } from './components/events/ExportEventDialog';
import Footer from './components/layout/Footer';
import Header from './components/layout/Header';
import ErrorBoundary from './components/shared/ErrorBoundary';
import { PageLoader } from './components/shared/PageLoader';
import ScrollToTop from './components/shared/ScrollToTop';
import { SettingsDialog } from './components/shared/SettingsDialog';
import { Toaster } from './components/ui/toaster';
import { useCalendarContext } from './contexts/CalendarContext';
import { useSettingsContext } from './contexts/SettingsContext';
import { useDialogs } from './hooks/useDialogs';
import { useLastUpdated } from './hooks/useLastUpdated';
import { MOBILE_QUERY, useMediaQuery } from './hooks/useMediaQuery';
import {
  useEggPoolFilters,
  useRaidBossFilters,
  useResearchTaskFilters,
  useRocketLineupFilters,
} from './hooks/usePageFilters';
import { useThemeMode } from './hooks/useThemeMode';
import { useToast } from './hooks/useToast';
import type { CalendarEvent, NewEventData } from './types/events';
import type { Settings } from './types/settings';
import { downloadIcsForEvents } from './utils/calendarUtils';

// Lazy load page components
const CalendarPage = lazy(() => import('./pages/Calendar'));
const FaqPage = lazy(() => import('./pages/Faq'));
const EggPoolPage = lazy(() => import('./pages/EggPool'));
const RaidBossesPage = lazy(() => import('./pages/RaidBosses'));
const ResearchTasksPage = lazy(() => import('./pages/ResearchTasks'));
const RocketLineupPage = lazy(() => import('./pages/RocketLineup'));

function App() {
  const { settings, setSettings } = useSettingsContext();
  useThemeMode(settings.theme);
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const { activeDialog, openDialog, closeDialog } = useDialogs();
  const { toast, showToast, handleCloseToast } = useToast();
  const [eventToEdit, setEventToEdit] = useState<CalendarEvent | null>(null);

  const {
    loading: eventsLoading,
    filters,
    setFilters,
    handleResetFilters,
    filteredEvents,
    allEvents,
    savedEventIds,
    allCategories,
    allPokemon,
    allBonuses,
    refetchEvents,
    addEvent,
    updateEvent,
    deleteEvent,
  } = useCalendarContext();

  // Page-specific filters
  const eggPoolFilterState = useEggPoolFilters();
  const raidBossFilterState = useRaidBossFilters();
  const researchTaskFilterState = useResearchTaskFilters();
  const rocketLineupFilterState = useRocketLineupFilters();

  // Available filter options for each page
  const [eggPoolOptions, setEggPoolOptions] = useState<{
    eggTiers: string[];
    rarityTiers: string[];
  }>({ eggTiers: [], rarityTiers: [] });

  const [raidBossOptions, setRaidBossOptions] = useState<{
    raidTiers: string[];
    types: string[];
  }>({ raidTiers: [], types: [] });

  const [researchTaskOptions, setResearchTaskOptions] = useState<{
    categories: string[];
  }>({ categories: [] });

  const [rocketLineupOptions, setRocketLineupOptions] = useState<{
    leaders: string[];
  }>({ leaders: [] });

  const {
    lastUpdated,
    loading: lastUpdatedLoading,
    error,
    refetch: refetchLastUpdated,
  } = useLastUpdated();

  const activeFilterCount = useMemo(() => {
    return (
      (filters.searchTerm ? 1 : 0) +
      filters.selectedCategories.length +
      (filters.startDate ? 1 : 0) +
      (filters.endDate ? 1 : 0) +
      (filters.showActiveOnly ? 1 : 0) +
      (filters.timeRange[0] > 0 || filters.timeRange[1] < 24 ? 1 : 0) +
      filters.pokemonSearch.length +
      filters.bonusSearch.length
    );
  }, [filters]);

  const handleSettingsChange = useCallback(
    (newSettings: Partial<Settings>) => {
      setSettings((prev) => ({ ...prev, ...newSettings }));
    },
    [setSettings]
  );

  const handleRefresh = useCallback(async () => {
    try {
      await Promise.all([refetchEvents(), refetchLastUpdated()]);
      showToast('Data refreshed successfully!', 'success');
    } catch {
      showToast('Failed to refresh data.', 'error');
    }
  }, [refetchEvents, refetchLastUpdated, showToast]);

  const handleOpenEditDialog = useCallback(
    (event: CalendarEvent) => {
      setEventToEdit(event);
      openDialog('create');
    },
    [openDialog]
  );

  const handleCloseCreateDialog = useCallback(() => {
    closeDialog();
    setEventToEdit(null);
  }, [closeDialog]);

  const handleSaveEvent = useCallback(
    (eventData: NewEventData, eventId?: string) => {
      if (eventId) {
        updateEvent(eventId, eventData);
        showToast('Event updated successfully!', 'success');
      } else {
        addEvent(eventData);
        showToast('Event created successfully!', 'success');
      }
      handleCloseCreateDialog();
    },
    [addEvent, updateEvent, handleCloseCreateDialog, showToast]
  );

  const handleDeleteEvent = useCallback(
    (eventId: string) => {
      deleteEvent(eventId);
      showToast('Event deleted successfully', 'success');
    },
    [deleteEvent, showToast]
  );

  const handleExport = useCallback(
    (eventsToExport: CalendarEvent[]) => {
      downloadIcsForEvents(eventsToExport, (error) => showToast(error, 'error'));
      showToast(`Exported ${eventsToExport.length} events!`, 'success');
    },
    [showToast]
  );

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header
        onSettingsClick={() => openDialog('settings')}
        onRefresh={handleRefresh}
        filters={filters}
        onFilterChange={setFilters}
        onResetFilters={handleResetFilters}
        onNewEventClick={() => openDialog('create')}
        onOpenExportDialog={() => openDialog('export')}
        allCategories={allCategories}
        allPokemon={allPokemon}
        allBonuses={allBonuses}
        lastUpdated={lastUpdated}
        lastUpdatedLoading={lastUpdatedLoading}
        lastUpdatedError={error}
        activeFilterCount={activeFilterCount}
        isMobile={isMobile}
        // Page-specific filters
        eggPoolFilters={eggPoolFilterState.filters}
        onEggPoolFilterChange={eggPoolFilterState.setFilters}
        onResetEggPoolFilters={eggPoolFilterState.resetFilters}
        eggPoolActiveFilterCount={eggPoolFilterState.activeFilterCount}
        eggPoolOptions={eggPoolOptions}
        raidBossFilters={raidBossFilterState.filters}
        onRaidBossFilterChange={raidBossFilterState.setFilters}
        onResetRaidBossFilters={raidBossFilterState.resetFilters}
        raidBossActiveFilterCount={raidBossFilterState.activeFilterCount}
        raidBossOptions={raidBossOptions}
        researchTaskFilters={researchTaskFilterState.filters}
        onResearchTaskFilterChange={researchTaskFilterState.setFilters}
        onResetResearchTaskFilters={researchTaskFilterState.resetFilters}
        researchTaskActiveFilterCount={researchTaskFilterState.activeFilterCount}
        researchTaskOptions={researchTaskOptions}
        rocketLineupFilters={rocketLineupFilterState.filters}
        onRocketLineupFilterChange={rocketLineupFilterState.setFilters}
        onResetRocketLineupFilters={rocketLineupFilterState.resetFilters}
        rocketLineupActiveFilterCount={rocketLineupFilterState.activeFilterCount}
        rocketLineupOptions={rocketLineupOptions}
      />
      <main className="flex-1 px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6">
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route
                path="/"
                element={
                  <div className="w-full">
                    <CalendarPage
                      isLoading={eventsLoading}
                      onEditEvent={handleOpenEditDialog}
                      onDeleteEvent={handleDeleteEvent}
                      showToast={showToast}
                      isMobile={isMobile}
                    />
                  </div>
                }
              />
              <Route
                path="/egg-pool"
                element={
                  <div className="mx-auto max-w-7xl">
                    <EggPoolPage
                      filters={eggPoolFilterState.filters}
                      onSetFilterOptions={setEggPoolOptions}
                    />
                  </div>
                }
              />
              <Route
                path="/raid-bosses"
                element={
                  <div className="mx-auto max-w-7xl">
                    <RaidBossesPage
                      filters={raidBossFilterState.filters}
                      onSetFilterOptions={setRaidBossOptions}
                    />
                  </div>
                }
              />
              <Route
                path="/research-tasks"
                element={
                  <div className="mx-auto max-w-7xl">
                    <ResearchTasksPage
                      filters={researchTaskFilterState.filters}
                      onSetFilterOptions={setResearchTaskOptions}
                    />
                  </div>
                }
              />
              <Route
                path="/rocket-lineup"
                element={
                  <div className="mx-auto max-w-7xl">
                    <RocketLineupPage
                      filters={rocketLineupFilterState.filters}
                      onSetFilterOptions={setRocketLineupOptions}
                    />
                  </div>
                }
              />
              <Route path="/faq" element={<FaqPage />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />

      <SettingsDialog
        open={activeDialog === 'settings'}
        onClose={closeDialog}
        onSettingsChange={handleSettingsChange}
      />
      <CreateEventDialog
        open={activeDialog === 'create'}
        onClose={handleCloseCreateDialog}
        onSave={handleSaveEvent}
        eventToEdit={eventToEdit}
      />
      <ExportEventDialog
        open={activeDialog === 'export'}
        onClose={closeDialog}
        onExport={handleExport}
        allEvents={allEvents}
        filteredEvents={filteredEvents}
        savedEventIds={savedEventIds}
      />
      <Toaster toast={toast} onClose={handleCloseToast} />
      <ScrollToTop />
    </div>
  );
}

export default App;
