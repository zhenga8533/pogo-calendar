import MenuIcon from "@mui/icons-material/Menu";
import { Alert, Box, Button, CircularProgress, Drawer, Snackbar, useMediaQuery, useTheme } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { type NewEventData, useCustomEvents } from "../../hooks/useCustomEvents";
import { useEventData } from "../../hooks/useEventData";
import { useFilters } from "../../hooks/useFilters";
import { useSavedEvents } from "../../hooks/useSavedEvents";
import EventCalendar from "../calendar/EventCalendar";
import CreateEventDialog from "../events/CreateEventDialog";
import EventFilter from "../filters/EventFilter";

/**
 * CalendarView component to display the event calendar with filters, saved events, and custom event creation.
 *
 * @returns The rendered CalendarView component.
 */
function CalendarView() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" as const });

  const { allEvents: apiEvents, loading } = useEventData();
  const { savedEventIds, handleToggleSaveEvent } = useSavedEvents();
  const { customEvents, addCustomEvent, deleteCustomEvent } = useCustomEvents();

  const combinedEvents = useMemo(() => [...apiEvents, ...customEvents], [apiEvents, customEvents]);

  // Use filters hook with combined events
  const { filters, setFilters, handleResetFilters, setCurrentView, filteredEvents } = useFilters(
    combinedEvents,
    savedEventIds
  );

  // Ensure "Custom Event" category is removed if there are no custom events
  useEffect(() => {
    if (customEvents.length === 0 && filters.selectedCategories.includes("Custom Event")) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        selectedCategories: prevFilters.selectedCategories.filter((c) => c !== "Custom Event"),
      }));
    }
  }, [customEvents, filters.selectedCategories, setFilters]);

  // Extract all unique categories from combined events for filter options
  const allCategories = useMemo(() => {
    const categories = new Set(combinedEvents.map((event) => event.extendedProps.category));
    return Array.from(categories).sort();
  }, [combinedEvents]);

  // Handle saving a new custom event
  const handleSaveNewEvent = (eventData: NewEventData) => {
    addCustomEvent(eventData);
    setCreateDialogOpen(false);

    setFilters((prevFilters) => {
      if (prevFilters.selectedCategories.length === 0) {
        return prevFilters;
      }

      return {
        ...prevFilters,
        selectedCategories: [...new Set([...prevFilters.selectedCategories, "Custom Event"])],
      };
    });

    setToast({ open: true, message: "Event created successfully!", severity: "success" });
  };

  // Handle deleting a custom event
  const handleDeleteEvent = (eventId: string) => {
    deleteCustomEvent(eventId);
    setToast({ open: true, message: "Event deleted successfully", severity: "success" });
  };

  // Handle closing the toast notification
  const handleCloseToast = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setToast({ ...toast, open: false });
  };

  // Filter component to be used in both drawer and sidebar
  const filterComponent = (
    <EventFilter
      filters={filters}
      onFilterChange={setFilters}
      onResetFilters={handleResetFilters}
      onNewEventClick={() => setCreateDialogOpen(true)}
      allCategories={allCategories}
    />
  );

  // Render loading spinner while events are being fetched
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <CircularProgress />
      </Box>
    );
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
        isMobile={isMobile}
        savedEventIds={savedEventIds}
        onToggleSaveEvent={handleToggleSaveEvent}
        onViewChange={setCurrentView}
        onDeleteEvent={handleDeleteEvent}
      />
      <CreateEventDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSave={handleSaveNewEvent}
      />
      <Snackbar open={toast.open} autoHideDuration={6000} onClose={handleCloseToast}>
        <Alert onClose={handleCloseToast} severity={toast.severity} sx={{ width: "100%" }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default CalendarView;
