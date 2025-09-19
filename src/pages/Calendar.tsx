import { Box } from "@mui/material";
import { CalendarSkeleton } from "../components/calendar/CalendarSkeleton";
import EventCalendar from "../components/calendar/EventCalendar";
import type { ToastSeverity } from "../hooks/useToast";
import type { CalendarEvent } from "../types/events";

interface CalendarPageProps {
  isLoading: boolean;
  filteredEvents: CalendarEvent[];
  savedEventIds: string[];
  eventNotes: Record<string, string>;
  selectedEvent: CalendarEvent | null;
  onSelectEvent: (event: CalendarEvent | null) => void;
  onToggleSaveEvent: (eventId: string) => void;
  onUpdateNote: (eventId: string, noteText: string) => void;
  onDeleteEvent: (eventId: string) => void;
  onEditEvent: (event: CalendarEvent) => void;
  onDateSelect: (selection: { start: Date | null; end: Date | null }) => void;
  onViewChange: (viewName: string) => void;
  showToast: (message: string, severity?: ToastSeverity) => void;
  filterStartDate: Date | null;
  filterEndDate: Date | null;
}

function CalendarPage(props: CalendarPageProps) {
  const {
    isLoading,
    filteredEvents,
    savedEventIds,
    eventNotes,
    selectedEvent,
    onSelectEvent,
    onToggleSaveEvent,
    onUpdateNote,
    onDeleteEvent,
    onEditEvent,
    onDateSelect,
    onViewChange,
    showToast,
    filterStartDate,
    filterEndDate,
  } = props;

  if (isLoading) {
    return <CalendarSkeleton isMobile={false} />;
  }

  return (
    <Box>
      <EventCalendar
        events={filteredEvents}
        isMobile={false}
        savedEventIds={savedEventIds}
        filterStartDate={filterStartDate}
        filterEndDate={filterEndDate}
        selectedEvent={selectedEvent}
        onSelectEvent={onSelectEvent}
        onToggleSaveEvent={onToggleSaveEvent}
        onViewChange={onViewChange}
        onUpdateNote={onUpdateNote}
        eventNotes={eventNotes}
        onDeleteEvent={onDeleteEvent}
        onEditEvent={onEditEvent}
        onDateSelect={onDateSelect}
        showToast={showToast}
      />
    </Box>
  );
}

export default CalendarPage;
