import { Alert, Box, Container, CssBaseline, Snackbar, ThemeProvider } from "@mui/material";
import { useCallback, useMemo, useRef, useState } from "react";
import { Route, Routes } from "react-router-dom";
import CreateEventDialog from "./components/events/CreateEventDialog";
import { ExportEventDialog } from "./components/events/ExportEventDialog";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import ScrollToTop from "./components/shared/ScrollToTop";
import { SettingsDialog } from "./components/shared/SettingsDialog";
import { useCalendarContext } from "./contexts/CalendarContext";
import { useSettingsContext } from "./contexts/SettingsContext";
import { useDialogs } from "./hooks/useDialogs";
import { useLastUpdated } from "./hooks/useLastUpdated";
import { useNextUpcomingEvent } from "./hooks/useNextUpcomingEvent";
import { useToast } from "./hooks/useToast";
import CalendarPage from "./pages/Calendar";
import FaqPage from "./pages/Faq";
import { CalendarDarkStyles } from "./styles/calendarDarkStyles";
import { getTheme } from "./theme";
import type { CalendarEvent, NewEventData } from "./types/events";
import type { Settings } from "./types/settings";
import { downloadIcsForEvents } from "./utils/calendarUtils";

function App() {
  const { settings, setSettings } = useSettingsContext();
  const theme = useMemo(() => getTheme(settings.theme === "auto" ? "light" : settings.theme), [settings.theme]);
  const {
    settingsOpen,
    createDialogOpen,
    exportDialogOpen,
    handleSettingsOpen,
    handleSettingsClose,
    handleCreateOpen,
    handleCreateClose,
    handleExportOpen,
    handleExportClose,
  } = useDialogs();
  const { toast, showToast, handleCloseToast } = useToast();
  const [eventToEdit, setEventToEdit] = useState<CalendarEvent | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const {
    loading,
    filters,
    setFilters,
    handleResetFilters,
    setCurrentView,
    filteredEvents,
    allEvents,
    savedEventIds,
    eventNotes,
    allCategories,
    allPokemon,
    allBonuses,
    refetchEvents,
    handleToggleSaveEvent,
    addEvent,
    updateEvent,
    deleteEvent,
    updateNote,
  } = useCalendarContext();

  const refetchLastUpdatedRef = useRef<() => Promise<void>>(() => Promise.resolve());
  const { refetch } = useLastUpdated();
  const nextUpcomingEvent = useNextUpcomingEvent(filteredEvents);

  const handleSettingsChange = useCallback(
    (newSettings: Partial<Settings>) => {
      setSettings((prev) => ({ ...prev, ...newSettings }));
    },
    [setSettings]
  );

  const setRefetchLastUpdated = useCallback((fetcher: () => Promise<void>) => {
    refetchLastUpdatedRef.current = fetcher;
  }, []);

  const handleRefresh = useCallback(async () => {
    try {
      await Promise.all([refetchEvents(), refetch()]);
      showToast("Data refreshed successfully!", "success");
    } catch (error) {
      showToast("Failed to refresh data.", "error");
    }
  }, [refetchEvents, refetch, showToast]);

  const handleOpenEditDialog = useCallback(
    (event: CalendarEvent) => {
      setEventToEdit(event);
      handleCreateOpen();
    },
    [handleCreateOpen]
  );

  const handleCloseCreateDialog = useCallback(() => {
    handleCreateClose();
    setEventToEdit(null);
  }, [handleCreateClose]);

  const handleSaveEvent = useCallback(
    (eventData: NewEventData, eventId?: string) => {
      if (eventId) {
        updateEvent(eventId, eventData);
        showToast("Event updated successfully!", "success");
      } else {
        addEvent(eventData);
        showToast("Event created successfully!", "success");
      }
      handleCloseCreateDialog();
    },
    [addEvent, updateEvent, handleCloseCreateDialog, showToast]
  );

  const handleDeleteEvent = useCallback(
    (eventId: string) => {
      deleteEvent(eventId);
      showToast("Event deleted successfully", "success");
    },
    [deleteEvent, showToast]
  );

  const handleExport = useCallback(
    (eventsToExport: CalendarEvent[]) => {
      downloadIcsForEvents(eventsToExport);
      showToast(`Exported ${eventsToExport.length} events!`, "success");
    },
    [showToast]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CalendarDarkStyles />
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Header
          onSettingsClick={handleSettingsOpen}
          onRefresh={handleRefresh}
          setRefetchLastUpdated={setRefetchLastUpdated}
          filters={filters}
          onFilterChange={setFilters}
          onResetFilters={handleResetFilters}
          onNewEventClick={handleCreateOpen}
          onOpenExportDialog={handleExportOpen}
          allCategories={allCategories}
          allPokemon={allPokemon}
          allBonuses={allBonuses}
          nextUpcomingEvent={nextUpcomingEvent}
          onSelectEvent={setSelectedEvent}
          showNextEventTracker={settings.showNextEvent}
        />
        <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: "background.default" }}>
          <Routes>
            <Route
              path="/"
              element={
                <Container maxWidth="xl">
                  <CalendarPage
                    isLoading={loading}
                    filteredEvents={filteredEvents}
                    savedEventIds={savedEventIds}
                    eventNotes={eventNotes}
                    selectedEvent={selectedEvent}
                    onSelectEvent={setSelectedEvent}
                    onToggleSaveEvent={handleToggleSaveEvent}
                    onUpdateNote={updateNote}
                    onDeleteEvent={handleDeleteEvent}
                    onEditEvent={handleOpenEditDialog}
                    onDateSelect={(selection) =>
                      setFilters((prev: any) => ({ ...prev, startDate: selection.start, endDate: selection.end }))
                    }
                    onViewChange={setCurrentView}
                    showToast={showToast}
                    filterStartDate={filters.startDate}
                    filterEndDate={filters.endDate}
                  />
                </Container>
              }
            />
            <Route path="/faq" element={<FaqPage />} />
          </Routes>
        </Box>
        <Footer />
      </Box>

      <SettingsDialog open={settingsOpen} onClose={handleSettingsClose} onSettingsChange={handleSettingsChange} />
      <CreateEventDialog
        open={createDialogOpen}
        onClose={handleCloseCreateDialog}
        onSave={handleSaveEvent}
        eventToEdit={eventToEdit}
      />
      <ExportEventDialog
        open={exportDialogOpen}
        onClose={handleExportClose}
        onExport={handleExport}
        allEvents={allEvents}
        filteredEvents={filteredEvents}
        savedEventIds={savedEventIds}
      />
      <Snackbar open={toast.open} autoHideDuration={6000} onClose={handleCloseToast}>
        <Alert onClose={handleCloseToast} severity={toast.severity} sx={{ width: "100%" }}>
          {toast.message}
        </Alert>
      </Snackbar>
      <ScrollToTop />
    </ThemeProvider>
  );
}

export default App;
