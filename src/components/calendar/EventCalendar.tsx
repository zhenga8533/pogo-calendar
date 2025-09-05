import type { EventClickArg, EventContentArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Link,
  Paper,
  Typography,
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
  savedEventIds: string[];
  onToggleSaveEvent: (eventId: string) => void;
}

function EventCalendar({ events, isMobile, savedEventIds, onToggleSaveEvent }: EventCalendarProps) {
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
      start: clickInfo.event.start ?? new Date(),
      end: clickInfo.event.end ?? new Date(),
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
    const { category, article_url } = eventInfo.event.extendedProps;
    const backgroundColor = categoryColors[category] || theme.palette.primary.main;
    const isSaved = savedEventIds.includes(article_url);

    return (
      <Box
        sx={{
          backgroundColor,
          color: "#fff",
          borderRadius: "4px",
          overflow: "hidden",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
        }}
      >
        <Box sx={{ p: "2px 8px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          <b>{eventInfo.timeText}</b>
          <i>{eventInfo.event.title}</i>
        </Box>
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSaveEvent(article_url);
          }}
          sx={{ color: "#fff" }}
        >
          {isSaved ? <StarIcon fontSize="inherit" /> : <StarBorderIcon fontSize="inherit" />}
        </IconButton>
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
          <DialogTitle>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h6" component="div" sx={{ mr: 2 }}>
                {selectedEvent.title}
              </Typography>
              <IconButton onClick={() => onToggleSaveEvent(selectedEvent.extendedProps.article_url)} color="primary">
                {savedEventIds.includes(selectedEvent.extendedProps.article_url) ? <StarIcon /> : <StarBorderIcon />}
              </IconButton>
            </Box>
          </DialogTitle>
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
