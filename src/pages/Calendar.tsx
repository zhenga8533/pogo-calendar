import { Box } from "@mui/material";
import { CalendarSkeleton } from "../components/calendar/CalendarSkeleton";
import EventCalendar from "../components/calendar/EventCalendar";
import { useCalendarContext } from "../contexts/CalendarContext";
import type { ToastSeverity } from "../hooks/useToast";
import type { CalendarEvent } from "../types/events";

interface CalendarPageProps {
  isLoading: boolean;
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (eventId: string) => void;
  showToast: (message: string, severity?: ToastSeverity) => void;
}

function CalendarPage(props: CalendarPageProps) {
  const { isLoading, onEditEvent, onDeleteEvent, showToast } = props;
  const {
    filteredEvents,
    savedEventIds,
    eventNotes,
    selectedEvent,
    setSelectedEvent,
    handleToggleSaveEvent,
    updateNote,
    setFilters,
    setCurrentView,
    filters,
  } = useCalendarContext();

  if (isLoading) {
    return <CalendarSkeleton isMobile={false} />;
  }

  return (
    <Box>
      <EventCalendar
        events={filteredEvents}
        isMobile={false}
        savedEventIds={savedEventIds}
        filterStartDate={filters.startDate}
        filterEndDate={filters.endDate}
        selectedEvent={selectedEvent}
        onSelectEvent={setSelectedEvent}
        onToggleSaveEvent={handleToggleSaveEvent}
        onViewChange={setCurrentView}
        onUpdateNote={updateNote}
        eventNotes={eventNotes}
        onDeleteEvent={onDeleteEvent}
        onEditEvent={onEditEvent}
        onDateSelect={(selection) =>
          setFilters((prev: any) => ({ ...prev, startDate: selection.start, endDate: selection.end }))
        }
        showToast={showToast}
      />
    </Box>
  );
}

export default CalendarPage;
