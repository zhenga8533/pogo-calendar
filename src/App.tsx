import { Box, Container, CssBaseline, ThemeProvider } from "@mui/material";
import { useCallback, useMemo, useRef, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { CalendarOverlays } from "./components/calendar/CalendarOverlays";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import ScrollToTop from "./components/shared/ScrollToTop";
import { SettingsDialog } from "./components/shared/SettingsDialog";
import { useCustomEvents } from "./hooks/useCustomEvents";
import { useEventData } from "./hooks/useEventData";
import { useEventNotes } from "./hooks/useEventNotes";
import { useFilters } from "./hooks/useFilters";
import { useNextUpcomingEvent } from "./hooks/useNextUpcomingEvent";
import { useSavedEvents } from "./hooks/useSavedEvents";
import { useSettings } from "./hooks/useSettings";
import CalendarPage from "./pages/Calendar";
import FaqPage from "./pages/Faq";
import { CalendarDarkStyles } from "./styles/calendarDarkStyles";
import type { CalendarEvent, NewEventData } from "./types/events";
import type { Settings } from "./types/settings";
import { downloadIcsForEvents } from "./utils/calendarUtils";

/**
 * The main application component that sets up theming, layout, and state management.
 *
 * @returns The main application component.
 */
function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { theme, settings, setSettings } = useSettings();
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({ open: false, message: "", severity: "success" });
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
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

  const allCategories = useMemo(
    () => Array.from(new Set(combinedEvents.map((event) => event.extendedProps.category))).sort(),
    [combinedEvents]
  );

  const nextUpcomingEvent = useNextUpcomingEvent(filteredEvents);

  const handleSettingsOpen = useCallback(() => setSettingsOpen(true), []);
  const handleSettingsClose = useCallback(() => setSettingsOpen(false), []);

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
      setToast({ open: true, message: "Data refreshed successfully!", severity: "success" });
    } catch (error) {
      setToast({ open: true, message: "Failed to refresh data.", severity: "error" });
    }
  }, [refetchEvents]);

  const handleCloseToast = useCallback(() => {
    setToast((prev) => ({ ...prev, open: false }));
  }, []);

  const handleOpenEditDialog = useCallback((event: CalendarEvent) => {
    setEventToEdit(event);
    setCreateDialogOpen(true);
  }, []);

  const handleCloseCreateDialog = useCallback(() => {
    setCreateDialogOpen(false);
    setEventToEdit(null);
  }, []);

  const handleSaveEvent = useCallback(
    (eventData: NewEventData, eventId?: string) => {
      if (eventId) {
        updateEvent(eventId, eventData);
        setToast({ open: true, message: "Event updated successfully!", severity: "success" });
      } else {
        addEvent(eventData);
        if (filters.selectedCategories.length > 0) {
          setFilters((prev) => ({
            ...prev,
            selectedCategories: [...new Set([...prev.selectedCategories, "Custom Event"])],
          }));
        }
        setToast({ open: true, message: "Event created successfully!", severity: "success" });
      }
      handleCloseCreateDialog();
    },
    [addEvent, updateEvent, filters.selectedCategories, setFilters, handleCloseCreateDialog]
  );

  const handleDeleteEvent = useCallback(
    (eventId: string) => {
      deleteEvent(eventId);
      setToast({ open: true, message: "Event deleted successfully", severity: "success" });
    },
    [deleteEvent]
  );

  const handleExport = useCallback((eventsToExport: CalendarEvent[]) => {
    downloadIcsForEvents(eventsToExport);
    setToast({ open: true, message: `Exported ${eventsToExport.length} events!`, severity: "success" });
  }, []);

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
          onNewEventClick={() => setCreateDialogOpen(true)}
          onOpenExportDialog={() => setExportDialogOpen(true)}
          allCategories={allCategories}
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
                    settings={settings}
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
                    setToast={setToast}
                  />
                </Container>
              }
            />
            <Route path="/faq" element={<FaqPage />} />
          </Routes>
        </Box>
        <Footer />
      </Box>

      <SettingsDialog
        open={settingsOpen}
        onClose={handleSettingsClose}
        settings={settings}
        onSettingsChange={handleSettingsChange}
      />
      <CalendarOverlays
        createDialogOpen={createDialogOpen}
        exportDialogOpen={exportDialogOpen}
        toast={toast}
        eventToEdit={eventToEdit}
        combinedEvents={combinedEvents}
        filteredEvents={filteredEvents}
        savedEventIds={savedEventIds}
        onCloseCreateDialog={handleCloseCreateDialog}
        onCloseExportDialog={() => setExportDialogOpen(false)}
        onSaveEvent={handleSaveEvent}
        onExport={handleExport}
        onCloseToast={handleCloseToast}
      />
      <ScrollToTop />
    </ThemeProvider>
  );
}

export default App;
