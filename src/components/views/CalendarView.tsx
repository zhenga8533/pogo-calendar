import MenuIcon from "@mui/icons-material/Menu";
import { Box, Button, CircularProgress, Drawer, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { fetchEvents } from "../../services/eventService";
import type { CalendarEvent } from "../../types/events";
import EventCalendar from "../calendar/EventCalendar";
import EventFilter from "../filters/EventFilter";

const initialFilters = {
  searchTerm: "",
  selectedCategories: [] as string[],
  startDate: null as Date | null,
  endDate: null as Date | null,
  timeRange: [0, 24],
};

function CalendarView() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [allEvents, setAllEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [savedEventIds, setSavedEventIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("savedEventIds");
    return saved ? JSON.parse(saved) : [];
  });

  const [filters, setFilters] = useState(() => {
    const savedFilters = localStorage.getItem("eventFilters");
    if (savedFilters) {
      const parsedFilters = JSON.parse(savedFilters);
      if (parsedFilters.startDate) parsedFilters.startDate = new Date(parsedFilters.startDate);
      if (parsedFilters.endDate) parsedFilters.endDate = new Date(parsedFilters.endDate);
      return parsedFilters;
    }
    return initialFilters;
  });

  useEffect(() => {
    localStorage.setItem("eventFilters", JSON.stringify(filters));
  }, [filters]);

  useEffect(() => {
    localStorage.setItem("savedEventIds", JSON.stringify(savedEventIds));
  }, [savedEventIds]);

  useEffect(() => {
    const getEvents = async () => {
      try {
        const eventData = await fetchEvents();
        setAllEvents(eventData);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    getEvents();
  }, []);

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  const handleToggleSaveEvent = (eventId: string) => {
    setSavedEventIds((prev) => (prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]));
  };

  const allCategories = useMemo(() => {
    const categories = new Set(allEvents.map((event) => event.extendedProps.category));
    return Array.from(categories).sort();
  }, [allEvents]);

  const filteredEvents = useMemo(() => {
    const { selectedCategories } = filters;
    const isSavedFilterActive = selectedCategories.includes("Saved");
    const otherSelectedCategories = selectedCategories.filter((c: string) => c !== "Saved");

    return allEvents.filter((event) => {
      const isEventSaved = savedEventIds.includes(event.extendedProps.article_url);

      // Saved events filtering
      if (isSavedFilterActive && !isEventSaved) {
        return false;
      }

      // Category filtering
      if (otherSelectedCategories.length > 0 && !otherSelectedCategories.includes(event.extendedProps.category)) {
        return false;
      }

      // Search term filtering
      const searchMatch = event.title.toLowerCase().includes(filters.searchTerm.toLowerCase());
      if (!searchMatch) return false;

      const eventStart = new Date(event.start!);
      const eventEnd = new Date(event.end!);
      const filterStart = filters.startDate;
      const filterEnd = filters.endDate;

      // Date range filtering
      if (filterStart && filterEnd && (eventStart >= filterEnd || eventEnd <= filterStart)) {
        return false;
      }
      if (filterStart && !filterEnd && eventEnd < filterStart) {
        return false;
      }
      if (!filterStart && filterEnd && eventStart > filterEnd) {
        return false;
      }

      // Time of day filtering
      if (filters.timeRange[0] > 0 || filters.timeRange[1] < 24) {
        const [startHour, endHour] = filters.timeRange;
        const eventStartHour = eventStart.getHours();
        const eventDuration = (eventEnd.getTime() - eventStart.getTime()) / (1000 * 60 * 60);

        if (eventDuration < 24 && (eventStartHour < startHour || eventStartHour >= endHour)) {
          return false;
        }
      }

      return true;
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
