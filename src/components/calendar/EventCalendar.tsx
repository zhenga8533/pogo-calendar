import type { EventClickArg, EventContentArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { Box, IconButton, Paper, useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import type { CalendarEvent } from "../../types/events";
import { getColorForCategory } from "../../utils/colorUtils";
import EventDetailDialog from "./EventDetailDialog";

interface EventCalendarProps {
  events: CalendarEvent[];
  isMobile: boolean;
  savedEventIds: string[];
  onToggleSaveEvent: (eventId: string) => void;
  onViewChange: (viewName: string) => void;
}

/**
 * EventCalendar component to display and manage calendar events.
 *
 * @param param0 Props containing events, mobile view flag, saved event IDs, toggle function, and view change handler.
 * @returns The rendered EventCalendar component.
 */
function EventCalendar({ events, isMobile, savedEventIds, onToggleSaveEvent, onViewChange }: EventCalendarProps) {
  const theme = useTheme();
  const calendarRef = useRef<FullCalendar>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Change calendar view based on device type
  useEffect(() => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.changeView(isMobile ? "listWeek" : "dayGridMonth");
    }
  }, [isMobile]);

  // Handle event click to open detail dialog
  const handleEventClick = (clickInfo: EventClickArg) => {
    setSelectedEvent({
      title: clickInfo.event.title,
      start: clickInfo.event.start ?? new Date(),
      end: clickInfo.event.end ?? new Date(),
      extendedProps: {
        category: clickInfo.event.extendedProps.category,
        article_url: clickInfo.event.extendedProps.article_url,
        banner_url: clickInfo.event.extendedProps.banner_url,
      },
    });
  };

  // Handle close the event detail dialog
  const handleCloseDialog = () => {
    setSelectedEvent(null);
  };

  // Render custom event content with category color and save icon
  const renderEventContent = (eventInfo: EventContentArg) => {
    const { category, article_url } = eventInfo.event.extendedProps;
    const backgroundColor = getColorForCategory(category, theme.palette.mode);
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
          border: "2px solid rgba(0, 0, 0, 0.2)",
          boxSizing: "border-box",
          transition: "box-shadow 0.15s ease-in-out, filter 0.15s ease-in-out",
          "&:hover": {
            filter: "brightness(1.2)",
            boxShadow: theme.shadows[4],
          },
        }}
      >
        <Box sx={{ p: "2px 8px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          <b>{eventInfo.timeText}</b> <i>{eventInfo.event.title}</i>
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

  // Render the FullCalendar component with event details dialog
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
          eventBackgroundColor="transparent"
          eventBorderColor="transparent"
          datesSet={(dateInfo) => {
            onViewChange(dateInfo.view.type);
          }}
        />
      </Paper>

      <EventDetailDialog
        event={selectedEvent}
        onClose={handleCloseDialog}
        savedEventIds={savedEventIds}
        onToggleSaveEvent={onToggleSaveEvent}
      />
    </>
  );
}

export default EventCalendar;
