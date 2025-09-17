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
import EventHoverDetails from "../events/EventHoverDetails";

interface EventCalendarProps {
  events: CalendarEvent[];
  isMobile: boolean;
  savedEventIds: string[];
  firstDay: number;
  hour12: boolean;
  timeZone: string;
  filterStartDate: Date | null;
  filterEndDate: Date | null;
  onToggleSaveEvent: (eventId: string) => void;
  onViewChange: (viewName: string) => void;
  onDeleteEvent: (eventId: string) => void;
  onUpdateNote: (eventId: string, noteText: string) => void;
  eventNotes: Record<string, string>;
  onEditEvent: (event: CalendarEvent) => void;
  onDateSelect: (selection: { start: Date | null; end: Date | null }) => void;
  setToast: (toast: { open: boolean; message: string; severity: string }) => void;
}

interface CalendarEventContentProps {
  eventInfo: EventContentArg;
  isSaved: boolean;
  onToggleSave: (eventId: string) => void;
  onMouseEnter: (e: React.MouseEvent<HTMLElement>, event: CalendarEvent) => void;
  onMouseLeave: () => void;
}

const CalendarEventContent = React.memo(function CalendarEventContent({
  eventInfo,
  isSaved,
  onToggleSave,
  onMouseEnter,
  onMouseLeave,
}: CalendarEventContentProps) {
  const theme = useTheme();
  const { category, article_url } = eventInfo.event.extendedProps;
  const backgroundColor = getColorForCategory(category, theme.palette.mode);

  return (
    <Box
      sx={{
        backgroundColor,
        color: theme.palette.getContrastText(backgroundColor),
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
      }}
      onMouseEnter={(e) => onMouseEnter(e, eventInfo.event as unknown as CalendarEvent)}
      onMouseLeave={onMouseLeave}
    >
      <Box sx={{ p: "2px 8px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        <b>{eventInfo.timeText}</b> <i>{eventInfo.event.title}</i>
      </Box>

      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          onToggleSave(article_url);
        }}
        sx={{ color: "inherit" }}
      >
        {isSaved ? <StarIcon fontSize="inherit" /> : <StarBorderIcon fontSize="inherit" />}
      </IconButton>
    </Box>
  );
});

function EventCalendar({
  events,
  isMobile,
  savedEventIds,
  firstDay,
  hour12,
  timeZone,
  filterStartDate,
  filterEndDate,
  onToggleSaveEvent,
  onViewChange,
  onDeleteEvent,
  onUpdateNote,
  eventNotes,
  onEditEvent,
  onDateSelect,
  setToast,
}: EventCalendarProps) {
  const calendarRef = useRef<FullCalendar>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const [popoverState, setPopoverState] = useState<{
    event: CalendarEvent | null;
    position: { top: number; left: number } | null;
  }>({ event: null, position: null });

  useEffect(() => {
    calendarRef.current?.getApi().changeView(isMobile ? "listWeek" : "dayGridMonth");
  }, [isMobile]);

  const findOriginalEvent = useCallback(
    (fcEvent: any) => {
      const articleUrl = fcEvent.extendedProps.article_url;
      return events.find((e) => e.extendedProps.article_url === articleUrl) || null;
    },
    [events]
  );

  const handleEventClick = useCallback(
    (clickInfo: EventClickArg) => {
      setSelectedEvent(findOriginalEvent(clickInfo.event));
    },
    [findOriginalEvent]
  );

  const handleCloseDialog = useCallback(() => {
    setSelectedEvent(null);
  }, []);

  const handleDateSelect = useCallback(
    (selectionInfo: DateSelectArg) => {
      const { start, end } = selectionInfo;
      const inclusiveEnd = new Date(end.getTime() - 1);

      const isSingleDay = start.toDateString() === inclusiveEnd.toDateString();
      const isDeselecting =
        isSingleDay &&
        filterStartDate?.toDateString() === start.toDateString() &&
        filterEndDate?.toDateString() === inclusiveEnd.toDateString();

      if (isDeselecting) {
        onDateSelect({ start: null, end: null });
        calendarRef.current?.getApi().unselect();
      } else {
        onDateSelect({ start, end: inclusiveEnd });
      }
    },
    [filterStartDate, filterEndDate, onDateSelect]
  );

  const handlePopoverOpen = useCallback(
    (event: React.MouseEvent<HTMLElement>, calendarEvent: CalendarEvent) => {
      const originalEvent = findOriginalEvent(calendarEvent);
      setPopoverState({
        event: originalEvent,
        position: { top: event.clientY, left: event.clientX },
      });
    },
    [findOriginalEvent]
  );

  const handlePopoverClose = useCallback(() => {
    setPopoverState({ event: null, position: null });
  }, []);

  const handleMouseMove = useCallback(
    (event: React.MouseEvent) => {
      if (popoverState.event) {
        setPopoverState((current) => ({
          ...current,
          position: { top: event.clientY, left: event.clientX },
        }));
      }
    },
    [popoverState.event]
  );

  const renderEventContent = useCallback(
    (eventInfo: EventContentArg) => {
      const article_url = eventInfo.event.extendedProps.article_url;
      const isSaved = savedEventIds.includes(article_url);

      return (
        <CalendarEventContent
          eventInfo={eventInfo}
          isSaved={isSaved}
          onToggleSave={onToggleSaveEvent}
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
        />
      );
    },
    [savedEventIds, onToggleSaveEvent, handlePopoverOpen, handlePopoverClose]
  );

  if (events.length === 0) {
    return (
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, md: 4 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
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

  return (
    <>
      <Paper elevation={3} sx={{ p: { xs: 1, md: 2 } }} onMouseMove={handleMouseMove}>
        <FullCalendar
          key={timeZone}
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
          headerToolbar={
            isMobile
              ? { left: "prev,next", center: "title", right: "listWeek,dayGridMonth" }
              : { left: "prev,next today", center: "title", right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek" }
          }
          initialView="dayGridMonth"
          events={events}
          eventClick={handleEventClick}
          eventContent={renderEventContent}
          height={isMobile ? "75vh" : "auto"}
          aspectRatio={isMobile ? 1.2 : 1.75}
          eventBackgroundColor="transparent"
          eventBorderColor="transparent"
          datesSet={(dateInfo) => onViewChange(dateInfo.view.type)}
          titleFormat={isMobile ? { month: "short", year: "numeric" } : { month: "long", year: "numeric" }}
          firstDay={firstDay}
          selectable={true}
          select={handleDateSelect}
          eventTimeFormat={{
            hour: hour12 ? "numeric" : "2-digit",
            minute: "2-digit",
            meridiem: hour12,
          }}
          timeZone={timeZone}
          eventDidMount={(arg) => {
            arg.el.setAttribute("data-event-id", arg.event.extendedProps.article_url);
          }}
          eventMouseEnter={(arg) => {
            const eventId = arg.event.extendedProps.article_url;
            const eventElements = document.querySelectorAll<HTMLElement>(`[data-event-id="${eventId}"]`);
            eventElements.forEach((el) => {
              el.style.filter = "brightness(1.3)";
              el.style.boxShadow = "0 0 8px rgba(0, 0, 0, 0.5)";
              el.style.zIndex = "10";
            });
          }}
          eventMouseLeave={(arg) => {
            const eventId = arg.event.extendedProps.article_url;
            const eventElements = document.querySelectorAll<HTMLElement>(`[data-event-id="${eventId}"]`);
            eventElements.forEach((el) => {
              el.style.filter = "";
              el.style.boxShadow = "";
              el.style.zIndex = "";
            });
          }}
        />
      </Paper>

      <EventHoverDetails
        open={Boolean(popoverState.event)}
        id={popoverState.event ? "mouse-over-popover" : undefined}
        mousePosition={popoverState.position}
        event={popoverState.event}
        hour12={hour12}
        onClose={handlePopoverClose}
      />

      <EventDetailDialog
        hour12={hour12}
        eventNotes={eventNotes}
        onUpdateNote={onUpdateNote}
        event={selectedEvent}
        onClose={handleCloseDialog}
        savedEventIds={savedEventIds}
        onToggleSaveEvent={onToggleSaveEvent}
        onDeleteEvent={onDeleteEvent}
        onEditEvent={onEditEvent}
        setToast={setToast}
      />
    </>
  );
}

export default EventCalendar;
