import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Link,
  Paper,
  useTheme,
} from "@mui/material";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { fetchEvents } from "../../services/eventService";
import type { CalendarEvent } from "../../types/events";

const localizer = momentLocalizer(moment);

const categoryColors: { [key: string]: string } = {
  "Community Day": "#E91E63",
  "Raid Day": "#F44336",
  "Raid Hour": "#9C27B0",
  Event: "#2196F3",
  "GO Battle League": "#4CAF50",
  "Pokémon Spotlight Hour": "#FF9800",
  "Raid Battles": "#607D8B",
};

function EventCalendar() {
  const theme = useTheme();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

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

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };

  const handleCloseDialog = () => {
    setSelectedEvent(null);
  };

  const eventStyleGetter = useMemo(() => {
    return (event: CalendarEvent) => {
      const backgroundColor = categoryColors[event.resource.category] || theme.palette.primary.main;
      const style = {
        backgroundColor,
        borderRadius: "5px",
        opacity: 0.8,
        color: "white",
        border: "0px",
        display: "block",
      };
      return {
        style,
      };
    };
  }, [theme.palette.primary.main]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Paper elevation={3} sx={{ p: 2, height: "85vh", backgroundColor: theme.palette.background.paper }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter}
        />
      </Paper>

      {selectedEvent && (
        <Dialog open={true} onClose={handleCloseDialog}>
          <DialogTitle>{selectedEvent.title}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <strong>Category:</strong> {selectedEvent.resource.category}
              <br />
              <strong>Starts:</strong> {moment(selectedEvent.start).format("MMMM Do YYYY, h:mm a")}
              <br />
              <strong>Ends:</strong> {moment(selectedEvent.end).format("MMMM Do YYYY, h:mm a")}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Close</Button>
            <Button
              component={Link}
              href={selectedEvent.resource.article_url}
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
            >
              Learn More
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}

export default EventCalendar;
