import { Box, CircularProgress } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { fetchEvents } from "../../services/eventService";
import { type CalendarEvent } from "../../types/events";

const localizer = momentLocalizer(moment);

function EventCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getEvents = async () => {
      try {
        const eventData = await fetchEvents();
        setEvents(eventData);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    getEvents();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "90vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ height: "90vh" }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
      />
    </Box>
  );
}

export default EventCalendar;
