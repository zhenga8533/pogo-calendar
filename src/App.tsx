import { Alert, Box, Container, CssBaseline, Snackbar, ThemeProvider } from "@mui/material";
import { useCallback, useMemo, useRef, useState } from "react";
import { Route, Routes } from "react-router-dom";
import CreateEventDialog from "./components/events/CreateEventDialog";
import { ExportEventDialog } from "./components/events/ExportEventDialog";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import ScrollToTop from "./components/shared/ScrollToTop";
import { SettingsDialog } from "./components/shared/SettingsDialog";
import { CUSTOM_EVENT_CATEGORY } from "./config/constants";
import { useSettingsContext } from "./contexts/SettingsContext";
import { useCustomEvents } from "./hooks/useCustomEvents";
import { useDialogs } from "./hooks/useDialogs";
import { useEventData } from "./hooks/useEventData";
import { useEventNotes } from "./hooks/useEventNotes";
import { useFilters } from "./hooks/useFilters";
import { useNextUpcomingEvent } from "./hooks/useNextUpcomingEvent";
import { useSavedEvents } from "./hooks/useSavedEvents";
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

  const refetchLastUpdatedRef = useRef<() => Promise<void>>(() => Promise.resolve());

  const { allEvents: apiEvents, loading, refetch: refetchEvents } = useEventData(settings.timezone);
  const { savedEventIds, handleToggleSaveEvent } = useSavedEvents();
  const { customEvents, addEvent, updateEvent, deleteEvent } = useCustomEvents();
  const { eventNotes, updateNote } = useEventNotes();

  const combinedEvents = useMemo(() => [...apiEvents, ...customEvents], [apiEvents, customEvents]);

  const { filters, setFilters, handleResetFilters, setCurrentView, filteredEvents } = useFilters(
    combinedEvents,
    savedEventIds
  );

  const { allCategories, allPokemon, allBonuses } = useMemo(() => {
    const categories = new Set<string>();
    const pokemon = new Set<string>();
    const bonuses = new Set<string>();

    combinedEvents.forEach((event) => {
      categories.add(event.extendedProps.category);
      (event.extendedProps.features ?? []).forEach((p) => pokemon.add(p));
      (event.extendedProps.spawns ?? []).forEach((p) => pokemon.add(p));
      (event.extendedProps.raids ?? []).forEach((p) => pokemon.add(p));
      (event.extendedProps.shiny ?? []).forEach((p) => pokemon.add(p));
      (event.extendedProps.shadow ?? []).forEach((p) => pokemon.add(p));
      (event.extendedProps.bonuses ?? []).forEach((b) => bonuses.add(b));
    });

    return {
      allCategories: Array.from(categories).sort(),
      allPokemon: Array.from(pokemon).sort(),
      allBonuses: Array.from(bonuses).sort(),
    };
  }, [combinedEvents]);

  const nextUpcomingEvent = useNextUpcomingEvent(filteredEvents);

  const handleSettingsChange = useCallback(
    (newSettings: Partial<Settings>) => {
      setSettings((prev) => ({ ...prev, ...newSettings }));
    },
    [setSettings]
  );

  const setRefetchLastUpdated = useCallback((refetch: () => Promise<void>) => {
    refetchLastUpdatedRef.current = refetch;
  }, []);

  const handleRefresh = useCallback(async () => {
    try {
      await Promise.all([refetchEvents(), refetchLastUpdatedRef.current()]);
      showToast("Data refreshed successfully!", "success");
    } catch (error) {
      showToast("Failed to refresh data.", "error");
    }
  }, [refetchEvents, showToast]);

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
        if (filters.selectedCategories.length > 0) {
          setFilters((prev) => ({
            ...prev,
            selectedCategories: [...new Set([...prev.selectedCategories, CUSTOM_EVENT_CATEGORY])],
          }));
        }
        showToast("Event created successfully!", "success");
      }
      handleCloseCreateDialog();
    },
    [addEvent, updateEvent, filters.selectedCategories, setFilters, handleCloseCreateDialog, showToast]
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
                      setFilters((prev) => ({ ...prev, startDate: selection.start, endDate: selection.end }))
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
        allEvents={combinedEvents}
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
