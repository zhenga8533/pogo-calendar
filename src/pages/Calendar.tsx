import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Box, Paper, Typography } from '@mui/material';
import { CalendarSkeleton } from '../components/calendar/CalendarSkeleton';
import EventCalendar from '../components/calendar/EventCalendar';
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
    return (
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, md: 4 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
          textAlign: 'center',
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
        <Typography variant="h5" component="p" color="error.main" gutterBottom>
          Failed to Load Events
        </Typography>
        <Typography color="text.secondary">{error}</Typography>
      </Paper>
    );
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
          setFilters((prev: any) => ({
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
