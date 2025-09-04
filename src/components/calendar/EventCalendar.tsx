import type { EventClickArg, EventContentArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
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
import { useEffect, useState } from "react";
import { fetchEvents } from "../../services/eventService";
import type { CalendarEvent } from "../../types/events";

const categoryColors: { [key: string]: string } = {
  "Community Day": "#E91E63",
  "Raid Day": "#F44336",
  "Raid Hour": "#9C27B0",
  Event: "#2196F3",
  "GO Battle League": "#4CAF50",
  "Pokémon Spotlight Hour": "#FF9800",
  "Raid Battles": "#607D8B",
  "Raid Weekend": "#D32F2F",
  "City Safari": "#009688",
  Season: "#795548",
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

  const handleEventClick = (clickInfo: EventClickArg) => {
    setSelectedEvent({
      title: clickInfo.event.title,
      start: clickInfo.event.start,
      end: clickInfo.event.end,
      extendedProps: {
        category: clickInfo.event.extendedProps.category,
        article_url: clickInfo.event.extendedProps.article_url,
      },
    });
  };

  const handleCloseDialog = () => {
    setSelectedEvent(null);
  };

  const renderEventContent = (eventInfo: EventContentArg) => {
    const category = eventInfo.event.extendedProps.category;
    const backgroundColor = categoryColors[category] || theme.palette.primary.main;
    return (
      <Box
        sx={{
          backgroundColor,
          color: "#fff",
          borderRadius: "4px",
          p: "2px 8px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          width: "100%",
          height: "100%",
        }}
      >
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
      </Box>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          p: 2,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
          }}
          initialView="dayGridMonth"
          events={events}
          eventClick={handleEventClick}
          eventContent={renderEventContent}
          height="85vh"
        />
      </Paper>

      {selectedEvent && (
        <Dialog open={true} onClose={handleCloseDialog}>
          <DialogTitle>{selectedEvent.title}</DialogTitle>
          <DialogContent>
            <DialogContentText component="div">
              <strong>Category:</strong> {selectedEvent.extendedProps.category}
              <br />
              <strong>Starts:</strong>{" "}
              {new Date(selectedEvent.start!).toLocaleString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
              <br />
              <strong>Ends:</strong>{" "}
              {new Date(selectedEvent.end!).toLocaleString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Close</Button>
            <Button
              component={Link}
              href={selectedEvent.extendedProps.article_url}
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
