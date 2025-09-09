import type { DateSelectArg, EventClickArg, EventContentArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { Box, IconButton, Paper, Typography, useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import type { CalendarEvent } from "../../types/events";
import { getColorForCategory } from "../../utils/colorUtils";
import EventDetailDialog from "./EventDetailDialog";

interface EventCalendarProps {
  events: CalendarEvent[];
  isMobile: boolean;
  savedEventIds: string[];
  firstDay: number;
  onToggleSaveEvent: (eventId: string) => void;
  onViewChange: (viewName: string) => void;
  onDeleteEvent: (eventId: string) => void;
  onEditEvent: (event: CalendarEvent) => void;
  onDateSelect: (selection: { start: Date; end: Date }) => void;
}

/**
 * EventCalendar component to display and manage calendar events.
 *
 * @param {EventCalendarProps} props Props containing events, mobile flag, saved event IDs, and handlers.
 * @returns {React.ReactElement} The rendered EventCalendar component.
 */
function EventCalendar({
  events,
  isMobile,
  savedEventIds,
  firstDay,
  onToggleSaveEvent,
  onViewChange,
  onDeleteEvent,
  onEditEvent,
  onDateSelect,
}: EventCalendarProps) {
  const theme = useTheme();
  const calendarRef = useRef<FullCalendar>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);

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

  // Handle date range selection on the calendar
  const handleDateSelect = (selectionInfo: DateSelectArg) => {
    const end = new Date(selectionInfo.end);
    end.setTime(end.getTime() - 1);
    onDateSelect({ start: selectionInfo.start, end });
  };

  // Render custom event content with category color and save icon
  const renderEventContent = (eventInfo: EventContentArg) => {
    const { category, article_url } = eventInfo.event.extendedProps;
    const backgroundColor = getColorForCategory(category, theme.palette.mode);
    const isSaved = savedEventIds.includes(article_url);
    const isHighlighted = hoveredEventId === article_url;

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
          filter: isHighlighted ? "brightness(1.2)" : "brightness(1)",
          boxShadow: isHighlighted ? theme.shadows[4] : "none",
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

  // Render a message if no events match the current filters
  if (events.length === 0) {
    return (
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, md: 4 },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
          flexDirection: "column",
        }}
      >
        <EventBusyIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
        <Typography variant="h6" component="p" color="text.secondary">
          No Events Found
        </Typography>
        <Typography color="text.secondary">Try adjusting your filters or creating a new custom event.</Typography>
      </Paper>
    );
  }

  // Render the FullCalendar component with event detail dialog
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
          eventMouseEnter={(arg) => setHoveredEventId(arg.event.extendedProps.article_url)}
          eventMouseLeave={() => setHoveredEventId(null)}
          height={isMobile ? "75vh" : "auto"}
          aspectRatio={isMobile ? 1.2 : 1.75}
          eventBackgroundColor="transparent"
          eventBorderColor="transparent"
          datesSet={(dateInfo) => {
            onViewChange(dateInfo.view.type);
          }}
          titleFormat={isMobile ? { month: "short", year: "numeric" } : { month: "long", year: "numeric" }}
          firstDay={firstDay}
          selectable={true}
          select={handleDateSelect}
        />
      </Paper>

      <EventDetailDialog
        event={selectedEvent}
        onClose={handleCloseDialog}
        savedEventIds={savedEventIds}
        onToggleSaveEvent={onToggleSaveEvent}
        onDeleteEvent={onDeleteEvent}
        onEditEvent={onEditEvent}
      />
    </>
  );
}

export default EventCalendar;
