import type { DateSelectArg, EventClickArg, EventContentArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import { Paper, Typography } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import type { ToastSeverity } from "../../hooks/useToast";
import type { CalendarEvent } from "../../types/events";
import EventDetailDialog from "../events/EventDetailDialog";
import EventHoverDetails from "../events/EventHoverDetails";
import { CalendarEventContent } from "./CalendarEventContent";

interface EventCalendarProps {
  events: CalendarEvent[];
  isMobile: boolean;
  savedEventIds: string[];
  firstDay: number;
  hour12: boolean;
  timeZone: string;
  filterStartDate: Date | null;
  filterEndDate: Date | null;
  selectedEvent: CalendarEvent | null;
  onSelectEvent: (event: CalendarEvent | null) => void;
  onToggleSaveEvent: (eventId: string) => void;
  onViewChange: (viewName: string) => void;
  onDeleteEvent: (eventId: string) => void;
  onUpdateNote: (eventId: string, noteText: string) => void;
  eventNotes: Record<string, string>;
  onEditEvent: (event: CalendarEvent) => void;
  onDateSelect: (selection: { start: Date | null; end: Date | null }) => void;
  showToast: (message: string, severity?: ToastSeverity) => void;
}

function EventCalendar({
  events,
  isMobile,
  savedEventIds,
  firstDay,
  hour12,
  timeZone,
  filterStartDate,
  filterEndDate,
  selectedEvent,
  onSelectEvent,
  onToggleSaveEvent,
  onViewChange,
  onDeleteEvent,
  onUpdateNote,
  eventNotes,
  onEditEvent,
  onDateSelect,
  showToast,
}: EventCalendarProps) {
  const calendarRef = useRef<FullCalendar>(null);
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
      onSelectEvent(findOriginalEvent(clickInfo.event));
    },
    [findOriginalEvent, onSelectEvent]
  );

  const handleCloseDialog = useCallback(() => {
    onSelectEvent(null);
  }, [onSelectEvent]);

  const handleDateSelect = useCallback(
    (selectionInfo: DateSelectArg) => {
      const { start, end } = selectionInfo;
      const inclusiveEnd = new Date(end.getTime() - 1);

      if (
        filterStartDate &&
        filterEndDate &&
        start.toDateString() === filterStartDate.toDateString() &&
        inclusiveEnd.toDateString() === filterEndDate.toDateString()
      ) {
        onDateSelect({ start: null, end: null });
        calendarRef.current?.getApi().unselect();
        return;
      }

      onDateSelect({ start, end: inclusiveEnd });
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
          unselectAuto={false}
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
        showToast={showToast}
      />
    </>
  );
}

export default EventCalendar;
