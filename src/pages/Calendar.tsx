// src/pages/Calendar.tsx

import { Box } from "@mui/material";
import { CalendarSkeleton } from "../components/calendar/CalendarSkeleton";
import EventCalendar from "../components/calendar/EventCalendar";
import type { CalendarEvent } from "../types/events";
import type { Settings } from "../types/settings";

interface CalendarPageProps {
  settings: Settings;
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
  setToast: (toast: { open: boolean; message: string; severity: "success" | "error" | "info" | "warning" }) => void;
}

function CalendarPage(props: CalendarPageProps) {
  const {
    settings,
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
    setToast,
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
        firstDay={settings.firstDay}
        hour12={settings.hour12}
        timeZone={settings.timezone}
        filterStartDate={null}
        filterEndDate={null}
        selectedEvent={selectedEvent}
        onSelectEvent={onSelectEvent}
        onToggleSaveEvent={onToggleSaveEvent}
        onViewChange={onViewChange}
        onUpdateNote={onUpdateNote}
        eventNotes={eventNotes}
        onDeleteEvent={onDeleteEvent}
        onEditEvent={onEditEvent}
        onDateSelect={onDateSelect}
        setToast={setToast}
      />
    </Box>
  );
}

export default CalendarPage;
