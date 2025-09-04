import { Box, CircularProgress } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { fetchEvents } from "../../services/eventService";
import type { CalendarEvent } from "../../types/events";
import EventCalendar from "../calendar/EventCalendar";
import EventFilter from "../filters/EventFilter";

function CalendarView() {
  const [allEvents, setAllEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState({
    searchTerm: "",
    selectedCategories: [] as string[],
    startDate: null as Date | null,
    endDate: null as Date | null,
    timeRange: [0, 24],
  });

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

  const allCategories = useMemo(() => {
    const categories = new Set(allEvents.map((event) => event.extendedProps.category));
    return Array.from(categories).sort();
  }, [allEvents]);

  const filteredEvents = useMemo(() => {
    return allEvents.filter((event) => {
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
  }, [allEvents, filters]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <EventFilter filters={filters} onFilterChange={setFilters} allCategories={allCategories} />
      <EventCalendar events={filteredEvents} />
    </Box>
  );
}

export default CalendarView;
