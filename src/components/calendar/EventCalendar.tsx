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
import React, { useCallback, useEffect, useRef, useState } from "react";
import type { CalendarEvent } from "../../types/events";
import { getColorForCategory } from "../../utils/colorUtils";
import EventDetailDialog from "../events/EventDetailDialog";

import EventHoverDetails from "./EventHoverDetails";

interface EventCalendarProps {
  events: CalendarEvent[];
  allOriginalEvents: CalendarEvent[];
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
 * @param {EventCalendarProps} props Props containing event data and handlers.
 * @returns {React.ReactElement} The rendered EventCalendar component.
 */
function EventCalendar({
  events,
  allOriginalEvents,
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

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [popoverEvent, setPopoverEvent] = useState<CalendarEvent | null>(null);
  const [mousePosition, setMousePosition] = useState<{ top: number; left: number } | null>(null);

  const open = Boolean(anchorEl);
  const id = open ? "mouse-over-popover" : undefined;

  // Change calendar view based on device type
  useEffect(() => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.changeView(isMobile ? "listWeek" : "dayGridMonth");
    }
  }, [isMobile]);

  // Handle event click to open detail dialog
  const handleFullCalendarEventClick = (clickInfo: EventClickArg) => {
    const eventId = clickInfo.event.extendedProps.article_url;
    const originalEvent = allOriginalEvents.find((e) => e.extendedProps.article_url === eventId);
    if (originalEvent) {
      setSelectedEvent(originalEvent);
    }
  };

  // Close the event detail dialog
  const handleCloseDialog = () => {
    setSelectedEvent(null);
  };

  // Handle date selection to create a new event
  const handleDateSelect = (selectionInfo: DateSelectArg) => {
    const end = new Date(selectionInfo.end);
    end.setTime(end.getTime() - 1);
    onDateSelect({ start: selectionInfo.start, end });
  };

  // Handle popover open on event hover
  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>, calendarEvent: CalendarEvent) => {
    setPopoverEvent(calendarEvent);
    setAnchorEl(event.currentTarget);
    setMousePosition({ top: event.clientY, left: event.clientX });
  };

  // Handle popover close
  const handlePopoverClose = () => {
    setAnchorEl(null);
    setPopoverEvent(null);
    setMousePosition(null);
  };

  // Track mouse position for popover placement
  const handleMouseMove = useCallback(
    (event: React.MouseEvent) => {
      if (open) {
        setMousePosition({ top: event.clientY, left: event.clientX });
      }
    },
    [open]
  );

  // Render custom event content with styling and save button
  const renderEventContent = (eventInfo: EventContentArg) => {
    const { category, article_url } = eventInfo.event.extendedProps;
    const backgroundColor = getColorForCategory(category, theme.palette.mode);
    const isSaved = savedEventIds.includes(article_url);

    const originalEventForHover = allOriginalEvents.find((e) => e.extendedProps.article_url === article_url);

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
        aria-owns={open ? "mouse-over-popover" : undefined}
        aria-haspopup="true"
        onMouseEnter={(e) => originalEventForHover && handlePopoverOpen(e, originalEventForHover)}
        onMouseLeave={handlePopoverClose}
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

  // Render message when no events are available
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

  // Main render of the EventCalendar component
  return (
    <>
      <Paper
        elevation={3}
        sx={{ p: { xs: 1, md: 2 }, backgroundColor: theme.palette.background.paper }}
        onMouseMove={handleMouseMove}
      >
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
          eventClick={handleFullCalendarEventClick}
          eventContent={renderEventContent}
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

      <EventHoverDetails
        open={open}
        id={id}
        mousePosition={mousePosition}
        event={popoverEvent}
        onClose={handlePopoverClose}
      />

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
