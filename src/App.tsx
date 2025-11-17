import {
  Alert,
  Box,
  Container,
  CssBaseline,
  Snackbar,
  ThemeProvider,
  useMediaQuery,
} from '@mui/material';
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
import { useCalendarContext } from './contexts/CalendarContext';
import { useSettingsContext } from './contexts/SettingsContext';
import { useDialogs } from './hooks/useDialogs';
import { useLastUpdated } from './hooks/useLastUpdated';
import { useNextUpcomingEvent } from './hooks/useNextUpcomingEvent';
import { useToast } from './hooks/useToast';
import { CalendarDarkStyles } from './styles/calendarDarkStyles';
import { getTheme } from './theme';
import type { CalendarEvent, NewEventData } from './types/events';
import type { Settings } from './types/settings';
import { downloadIcsForEvents } from './utils/calendarUtils';

// Lazy load page components
const CalendarPage = lazy(() => import('./pages/Calendar'));
const FaqPage = lazy(() => import('./pages/Faq'));

function App() {
  const { settings, setSettings } = useSettingsContext();
  const muiTheme = useMemo(
    () => getTheme(settings.theme === 'auto' ? 'light' : settings.theme),
    [settings.theme]
  );
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
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
    setSelectedEvent,
  } = useCalendarContext();

  const {
    lastUpdated,
    loading: lastUpdatedLoading,
    error,
    refetch: refetchLastUpdated,
  } = useLastUpdated();
  const nextUpcomingEvent = useNextUpcomingEvent(filteredEvents);

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
    } catch (error) {
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
      downloadIcsForEvents(eventsToExport, (error) =>
        showToast(error, 'error')
      );
      showToast(`Exported ${eventsToExport.length} events!`, 'success');
    },
    [showToast]
  );

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <CalendarDarkStyles />
      <Box
        sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
      >
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
          nextUpcomingEvent={nextUpcomingEvent}
          onSelectEvent={setSelectedEvent}
          showNextEventTracker={settings.showNextEvent}
          lastUpdated={lastUpdated}
          lastUpdatedLoading={lastUpdatedLoading}
          lastUpdatedError={error}
          activeFilterCount={activeFilterCount}
          isMobile={isMobile}
        />
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, backgroundColor: 'background.default' }}
        >
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route
                  path="/"
                  element={
                    <Container maxWidth="xl">
                      <CalendarPage
                        isLoading={eventsLoading}
                        onEditEvent={handleOpenEditDialog}
                        onDeleteEvent={handleDeleteEvent}
                        showToast={showToast}
                        isMobile={isMobile}
                      />
                    </Container>
                  }
                />
                <Route path="/faq" element={<FaqPage />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </Box>
        <Footer />
      </Box>

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
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={handleCloseToast}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toast.severity}
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
      <ScrollToTop />
    </ThemeProvider>
  );
}

export default App;
