import MenuIcon from "@mui/icons-material/Menu";
import { Box, Button, CircularProgress, Drawer, useMediaQuery, useTheme } from "@mui/material";
import { useMemo, useState } from "react";
import { useEventData } from "../../hooks/useEventData";
import { useFilters } from "../../hooks/useFilters";
import { useSavedEvents } from "../../hooks/useSavedEvents";
import EventCalendar from "../calendar/EventCalendar";
import EventFilter from "../filters/EventFilter";

function CalendarView() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { allEvents, loading } = useEventData();
  const { filters, setFilters, handleResetFilters } = useFilters();
  const { savedEventIds, handleToggleSaveEvent } = useSavedEvents();

  const allCategories = useMemo(() => {
    const categories = new Set(allEvents.map((event) => event.extendedProps.category));
    return Array.from(categories).sort();
  }, [allEvents]);

  const filteredEvents = useMemo(() => {
    let eventsToFilter = allEvents;

    if (filters.showOnlySaved) {
      eventsToFilter = eventsToFilter.filter((event) => savedEventIds.includes(event.extendedProps.article_url));
    }

    return eventsToFilter.filter((event) => {
      const searchMatch = event.title.toLowerCase().includes(filters.searchTerm.toLowerCase());

      const categoryMatch =
        filters.selectedCategories.length === 0 || filters.selectedCategories.includes(event.extendedProps.category);

      const eventStart = new Date(event.start!);
      const eventEnd = new Date(event.end!);
      const filterStart = filters.startDate;
      const filterEnd = filters.endDate;
      let dateMatch = true;

      if (filterStart && filterEnd) {
        dateMatch = eventStart < filterEnd && eventEnd > filterStart;
      } else if (filterStart) {
        dateMatch = eventEnd >= filterStart;
      } else if (filterEnd) {
        dateMatch = eventStart <= filterEnd;
      }

      let timeOfDayMatch = true;
      if (filters.timeRange[0] > 0 || filters.timeRange[1] < 24) {
        const [startHour, endHour] = filters.timeRange;
        const eventStartHour = eventStart.getHours();
        const eventDuration = (eventEnd.getTime() - eventStart.getTime()) / (1000 * 60 * 60);
        if (eventDuration >= 24) {
          timeOfDayMatch = true;
        } else {
          timeOfDayMatch = eventStartHour >= startHour && eventStartHour < endHour;
        }
      }

      return searchMatch && categoryMatch && dateMatch && timeOfDayMatch;
    });
  }, [allEvents, filters, savedEventIds]);

  const filterComponent = (
    <EventFilter
      filters={filters}
      onFilterChange={setFilters}
      onResetFilters={handleResetFilters}
      allCategories={allCategories}
    />
  );

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <CircularProgress />
      </Box>
    );
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
        onToggleSaveEvent={handleToggleSaveEvent}
      />
    </Box>
  );
}

export default CalendarView;
