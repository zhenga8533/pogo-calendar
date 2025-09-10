import MenuIcon from "@mui/icons-material/Menu";
import { Alert, Box, Button, Drawer, Snackbar, useMediaQuery, useTheme } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { CalendarSkeleton } from "../components/calendar/CalendarSkeleton";
import EventCalendar from "../components/calendar/EventCalendar";
import CreateEventDialog from "../components/events/CreateEventDialog";
import { ExportEventDialog } from "../components/events/ExportEventDialog";
import EventFilter from "../components/filters/EventFilter";
import { type NewEventData, useCustomEvents } from "../hooks/useCustomEvents";
import { useEventData } from "../hooks/useEventData";
import { useFilters } from "../hooks/useFilters";
import { useSavedEvents } from "../hooks/useSavedEvents";
import type { CalendarEvent } from "../types/events";
import { downloadIcsForEvents } from "../utils/calendarUtils";

/**
 * Calendar page component to display the event calendar with filters, saved events, and custom event creation.
 *
 * @returns The rendered Calendar page component.
 */
function Calendar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<CalendarEvent | null>(null);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" as const });

  const { allEvents: apiEvents, loading } = useEventData();
  const { savedEventIds, handleToggleSaveEvent } = useSavedEvents();
  const { customEvents, addCustomEvent, updateCustomEvent, deleteCustomEvent } = useCustomEvents();

  const combinedEvents = useMemo(() => [...apiEvents, ...customEvents], [apiEvents, customEvents]);

  // Use filters hook with combined events
  const { filters, setFilters, handleResetFilters, setCurrentView, filteredEvents } = useFilters(
    combinedEvents,
    savedEventIds
  );

  // Compute all unique categories from combined events
  const allCategories = useMemo(() => {
    const categories = new Set(combinedEvents.map((event) => event.extendedProps.category));
    return Array.from(categories).sort();
  }, [combinedEvents]);

  // Ensure "Custom Event" category is removed if no custom events exist
  useEffect(() => {
    if (!allCategories.includes("Custom Event") && filters.selectedCategories.includes("Custom Event")) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        selectedCategories: prevFilters.selectedCategories.filter((c) => c !== "Custom Event"),
      }));
    }
  }, [allCategories, filters.selectedCategories, setFilters]);

  // Handle opening the dialog to edit an event
  const handleOpenEditDialog = (event: CalendarEvent) => {
    setEventToEdit(event);
    setCreateDialogOpen(true);
  };

  // Handle saving a new or updated custom event
  const handleSaveEvent = (eventData: NewEventData, eventId?: string) => {
    if (eventId) {
      updateCustomEvent(eventId, eventData);
      setToast({ open: true, message: "Event updated successfully!", severity: "success" });
    } else {
      addCustomEvent(eventData);
      if (filters.selectedCategories.length > 0) {
        setFilters((prevFilters) => ({
          ...prevFilters,
          selectedCategories: [...new Set([...prevFilters.selectedCategories, "Custom Event"])],
        }));
      }
      setToast({ open: true, message: "Event created successfully!", severity: "success" });
    }
    setCreateDialogOpen(false);
    setEventToEdit(null);
  };

  // Handle deleting a custom event
  const handleDeleteEvent = (eventId: string) => {
    deleteCustomEvent(eventId);
    setToast({ open: true, message: "Event deleted successfully", severity: "success" });
  };

  // Handle exporting selected events
  const handleExport = (eventsToExport: CalendarEvent[]) => {
    downloadIcsForEvents(eventsToExport);
    setToast({ open: true, message: `Exported ${eventsToExport.length} events!`, severity: "success" });
  };

  // Handle closing the toast notification
  const handleCalendarDateSelect = (selection: { start: Date; end: Date }) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      startDate: selection.start,
      endDate: selection.end,
    }));
  };

  // Filter component to be used in both drawer and inline
  const handleCloseToast = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setToast({ ...toast, open: false });
  };

  // Filter component to be used in both drawer and inline
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

  // Show loading skeleton while data is being fetched
  if (loading) {
    return <CalendarSkeleton isMobile={isMobile} />;
  }

  // Render the calendar view with filters and event calendar
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
        allOriginalEvents={combinedEvents}
        isMobile={isMobile}
        savedEventIds={savedEventIds}
        firstDay={filters.firstDay}
        onToggleSaveEvent={handleToggleSaveEvent}
        onViewChange={setCurrentView}
        onDeleteEvent={handleDeleteEvent}
        onEditEvent={handleOpenEditDialog}
        onDateSelect={handleCalendarDateSelect}
      />
      <CreateEventDialog
        open={createDialogOpen}
        onClose={() => {
          setCreateDialogOpen(false);
          setEventToEdit(null);
        }}
        onSave={handleSaveEvent}
        eventToEdit={eventToEdit}
      />
      <ExportEventDialog
        open={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
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
    </Box>
  );
}

export default Calendar;
