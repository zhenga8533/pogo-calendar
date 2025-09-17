import MenuIcon from "@mui/icons-material/Menu";
import { Alert, Box, Button, Drawer, Snackbar, useMediaQuery, useTheme } from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarSkeleton } from "../components/calendar/CalendarSkeleton";
import EventCalendar from "../components/calendar/EventCalendar";
import CreateEventDialog from "../components/events/CreateEventDialog";
import { ExportEventDialog } from "../components/events/ExportEventDialog";
import EventFilter from "../components/filters/EventFilter";
import { useCustomEvents } from "../hooks/useCustomEvents";
import { useEventData } from "../hooks/useEventData";
import { useEventNotes } from "../hooks/useEventNotes";
import { useFilters } from "../hooks/useFilters";
import { useSavedEvents } from "../hooks/useSavedEvents";
import type { CalendarEvent, NewEventData } from "../types/events";
import type { Settings } from "../types/settings";
import { downloadIcsForEvents } from "../utils/calendarUtils";

const CalendarOverlays = React.memo(
  /**
   * Renders overlays for the calendar page, including dialogs and toasts.
   *
   * @param param0 Props for the CalendarOverlays component.
   * @returns Overlays for the calendar page, including dialogs and toasts.
   */
  function CalendarOverlays({
    createDialogOpen,
    exportDialogOpen,
    toast,
    eventToEdit,
    combinedEvents,
    filteredEvents,
    savedEventIds,
    onCloseCreateDialog,
    onCloseExportDialog,
    onSaveEvent,
    onExport,
    onCloseToast,
  }: any) {
    return (
      <>
        {/* Dialog for creating events */}
        <CreateEventDialog
          open={createDialogOpen}
          onClose={onCloseCreateDialog}
          onSave={onSaveEvent}
          eventToEdit={eventToEdit}
        />

        {/* Dialog for exporting events */}
        <ExportEventDialog
          open={exportDialogOpen}
          onClose={onCloseExportDialog}
          onExport={onExport}
          allEvents={combinedEvents}
          filteredEvents={filteredEvents}
          savedEventIds={savedEventIds}
        />

        {/* Toast notifications */}
        <Snackbar open={toast.open} autoHideDuration={6000} onClose={onCloseToast}>
          <Alert onClose={onCloseToast} severity={toast.severity} sx={{ width: "100%" }}>
            {toast.message}
          </Alert>
        </Snackbar>
      </>
    );
  }
);

// --- Main Calendar Page Component ---

function Calendar({ settings }: { settings: Settings }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // --- State Management ---
  // UI State for dialogs, drawers, and toasts
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<CalendarEvent | null>(null);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" as const });

  // Custom hooks for application state and logic
  const { allEvents: apiEvents, loading } = useEventData(settings.timezone);
  const { savedEventIds, handleToggleSaveEvent } = useSavedEvents();
  const { customEvents, addEvent, updateEvent, deleteEvent } = useCustomEvents();
  const { eventNotes, updateNote } = useEventNotes();

  // Combine API and custom events for filtering
  const combinedEvents = useMemo(() => [...apiEvents, ...customEvents], [apiEvents, customEvents]);
  const { filters, setFilters, handleResetFilters, setCurrentView, filteredEvents } = useFilters(
    combinedEvents,
    savedEventIds
  );
  const allCategories = useMemo(
    () => Array.from(new Set(combinedEvents.map((event) => event.extendedProps.category))).sort(),
    [combinedEvents]
  );

  // --- Effects ---
  // Effect to deselect the "Custom Event" category if no custom events exist.
  useEffect(() => {
    if (!allCategories.includes("Custom Event") && filters.selectedCategories.includes("Custom Event")) {
      // Use the functional update form of setFilters to avoid dependency array issues.
      setFilters((prev) => ({
        ...prev,
        selectedCategories: prev.selectedCategories.filter((c) => c !== "Custom Event"),
      }));
    }
  }, [allCategories, filters.selectedCategories, setFilters]);

  // --- Handlers (memoized with useCallback) ---

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
        // Automatically select the "Custom Event" category when a new one is made.
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

  const handleCalendarDateSelect = useCallback(
    (selection: { start: Date | null; end: Date | null }) => {
      setFilters((prev) => ({ ...prev, startDate: selection.start, endDate: selection.end }));
    },
    [setFilters]
  );

  const handleCloseToast = useCallback(() => {
    setToast((prev) => ({ ...prev, open: false }));
  }, []);

  // --- Render Logic ---
  const filterComponent = (
    <EventFilter
      filters={filters}
      onFilterChange={setFilters}
      onResetFilters={handleResetFilters}
      onNewEventClick={() => setCreateDialogOpen(true)}
      onOpenExportDialog={() => setExportDialogOpen(true)}
      allCategories={allCategories}
      isMobile={isMobile}
    />
  );

  if (loading) {
    return <CalendarSkeleton isMobile={isMobile} />;
  }

  return (
    <Box>
      {isMobile ? (
        <>
          <Button variant="contained" startIcon={<MenuIcon />} onClick={() => setDrawerOpen(true)} sx={{ mb: 2 }}>
            Show Filters
          </Button>
          <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
            <Box sx={{ width: 300, p: 2 }}>{filterComponent}</Box>
          </Drawer>
        </>
      ) : (
        filterComponent
      )}
      <EventCalendar
        events={filteredEvents}
        isMobile={isMobile}
        savedEventIds={savedEventIds}
        firstDay={settings.firstDay}
        hour12={settings.hour12}
        timeZone={settings.timezone}
        filterStartDate={filters.startDate}
        filterEndDate={filters.endDate}
        onToggleSaveEvent={handleToggleSaveEvent}
        onViewChange={setCurrentView}
        onUpdateNote={updateNote}
        eventNotes={eventNotes}
        onDeleteEvent={handleDeleteEvent}
        onEditEvent={handleOpenEditDialog}
        onDateSelect={handleCalendarDateSelect}
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
    </Box>
  );
}

export default Calendar;
