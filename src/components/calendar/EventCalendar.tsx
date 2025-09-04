import type { EventClickArg, EventContentArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Link,
  Paper,
  useTheme,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
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

interface EventCalendarProps {
  events: CalendarEvent[];
  isMobile: boolean;
}

function EventCalendar({ events, isMobile }: EventCalendarProps) {
  const theme = useTheme();
  const calendarRef = useRef<FullCalendar>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  useEffect(() => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.changeView(isMobile ? "listWeek" : "dayGridMonth");
    }
  }, [isMobile]);

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

  return (
    <>
      <Paper elevation={3} sx={{ p: { xs: 1, md: 2 }, backgroundColor: theme.palette.background.paper }}>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
          headerToolbar={
            isMobile
              ? {
                  left: "prev,next",
                  center: "title",
                  right: "listWeek,dayGridMonth",
                }
              : {
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
                }
          }
          initialView="dayGridMonth"
          events={events}
          eventClick={handleEventClick}
          eventContent={renderEventContent}
          height={isMobile ? "75vh" : "auto"}
          aspectRatio={isMobile ? 1.2 : 1.75}
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
