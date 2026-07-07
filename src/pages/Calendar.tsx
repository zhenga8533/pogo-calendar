import { Box } from '@mui/material';
import { CalendarSkeleton } from '../components/calendar/CalendarSkeleton';
import EventCalendar from '../components/calendar/EventCalendar';
import { DataErrorDisplay } from '../components/shared/DataErrorDisplay';
import { useCalendarContext } from '../contexts/CalendarContext';
import type { ToastSeverity } from '../hooks/useToast';
import type { CalendarEvent } from '../types/events';

interface CalendarPageProps {
  isLoading: boolean;
  isMobile: boolean;
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (eventId: string) => void;
  showToast: (message: string, severity?: ToastSeverity) => void;
}

function CalendarPage(props: CalendarPageProps) {
  const { isLoading, isMobile, onEditEvent, onDeleteEvent, showToast } = props;
  const {
    error,
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
    return <CalendarSkeleton isMobile={isMobile} />;
  }

  if (error) {
    return <DataErrorDisplay title="Failed to Load Events" message={error} />;
  }

  return (
    <Box>
      <EventCalendar
        events={filteredEvents}
        isMobile={isMobile}
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
          setFilters((prev) => ({
            ...prev,
            startDate: selection.start,
            endDate: selection.end,
          }))
        }
        showToast={showToast}
      />
    </Box>
  );
}

export default CalendarPage;
