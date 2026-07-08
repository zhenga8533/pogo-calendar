import type { DateSelectArg, EventClickArg, EventContentArg, FormatterInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { CalendarX } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSettingsContext } from '../../contexts/SettingsContext';
import type { ToastSeverity } from '../../hooks/useToast';
import type { CalendarEvent } from '../../types/events';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import EventDetailDialog from '../events/EventDetailDialog';
import EventHoverDetails from '../events/EventHoverDetails';
import { CalendarEventContent } from './CalendarEventContent';

interface EventCalendarProps {
  events: CalendarEvent[];
  isMobile: boolean;
  savedEventIds: string[];
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
  const { settings } = useSettingsContext();
  const { firstDay, hour12, timezone } = settings;

  const [popoverState, setPopoverState] = useState<{
    event: CalendarEvent | null;
    position: { top: number; left: number } | null;
  }>({ event: null, position: null });

  useEffect(() => {
    const timer = setTimeout(() => {
      calendarRef.current?.getApi().changeView(isMobile ? 'listWeek' : 'dayGridMonth');
    }, 0);
    return () => clearTimeout(timer);
  }, [isMobile]);

  const eventTimeFormat: FormatterInput = {
    hour: isMobile ? 'numeric' : hour12 ? 'numeric' : '2-digit',
    minute: isMobile ? undefined : '2-digit',
    meridiem: isMobile ? 'short' : hour12,
  };

  const findOriginalEvent = useCallback(
    (fcEvent: { extendedProps: { article_url?: string; [key: string]: unknown } }) => {
      const articleUrl = fcEvent.extendedProps.article_url as string;
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

  const getEventClassSelector = (url: string) => {
    return `event-${url.replace(/[^a-zA-Z0-9]/g, '_')}`;
  };

  const handlePopoverOpen = useCallback(
    (event: React.MouseEvent<HTMLElement>, calendarEvent: CalendarEvent) => {
      const originalEvent = findOriginalEvent(calendarEvent);

      // Highlighting Logic
      const selector = getEventClassSelector(calendarEvent.extendedProps.article_url);
      const elements = document.querySelectorAll(`.${selector}`);
      elements.forEach((el) => el.classList.add('event-highlight'));

      setPopoverState({
        event: originalEvent,
        position: { top: event.clientY, left: event.clientX },
      });
    },
    [findOriginalEvent]
  );

  const handlePopoverClose = useCallback(() => {
    // Remove highlight from all events
    const elements = document.querySelectorAll('.event-highlight');
    elements.forEach((el) => el.classList.remove('event-highlight'));

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
      <Card className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center shadow-soft-lg md:p-16">
        <CalendarX className="mb-4 h-16 w-16 text-muted-foreground" />
        <h2 className="mb-2 text-xl font-bold">No Events Found</h2>
        <p className="mb-4 text-muted-foreground">
          Try adjusting your filters or creating a new custom event.
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Reset All Filters
        </Button>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-2 shadow-soft-lg md:p-4" onMouseMove={handleMouseMove}>
        <FullCalendar
          key={timezone}
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
          headerToolbar={
            isMobile
              ? {
                  left: 'prev,next',
                  center: 'title',
                  right: 'listWeek,dayGridMonth',
                }
              : {
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
                }
          }
          initialView="dayGridMonth"
          events={events}
          eventClick={handleEventClick}
          eventContent={renderEventContent}
          height={isMobile ? '75vh' : 'auto'}
          aspectRatio={isMobile ? 1.2 : 1.75}
          eventBackgroundColor="transparent"
          eventBorderColor="transparent"
          datesSet={(dateInfo) => onViewChange(dateInfo.view.type)}
          titleFormat={isMobile ? { month: 'short', year: 'numeric' } : { month: 'long', year: 'numeric' }}
          firstDay={firstDay}
          selectable={true}
          select={handleDateSelect}
          unselectAuto={false}
          eventTimeFormat={eventTimeFormat}
          timeZone={timezone}
          eventClassNames={(arg) => {
            return getEventClassSelector(arg.event.extendedProps.article_url);
          }}
        />
      </Card>

      <EventHoverDetails
        open={Boolean(popoverState.event)}
        mousePosition={popoverState.position}
        event={popoverState.event}
        onClose={handlePopoverClose}
      />

      <EventDetailDialog
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
