import { Alert, Snackbar } from "@mui/material";
import React from "react";
import type { CalendarEvent, NewEventData } from "../../types/events";
import CreateEventDialog from "../events/CreateEventDialog";
import { ExportEventDialog } from "../events/ExportEventDialog";

interface CalendarOverlaysProps {
  createDialogOpen: boolean;
  exportDialogOpen: boolean;
  toast: { open: boolean; message: string; severity: "success" | "error" | "info" | "warning" };
  eventToEdit: CalendarEvent | null;
  combinedEvents: CalendarEvent[];
  filteredEvents: CalendarEvent[];
  savedEventIds: string[];
  onCloseCreateDialog: () => void;
  onCloseExportDialog: () => void;
  onSaveEvent: (eventData: NewEventData, eventId?: string) => void;
  onExport: (events: CalendarEvent[]) => void;
  onCloseToast: () => void;
}

export const CalendarOverlays = React.memo(function CalendarOverlays(props: CalendarOverlaysProps) {
  const {
    createDialogOpen,
    exportDialogOpen,
    toast,
    eventToEdit,
    combinedEvents,
    filteredEvents,
    savedEventIds,
    onCloseCreateDialog,
    onCloseExportDialog,
    onSaveEvent,
    onExport,
    onCloseToast,
  } = props;

  return (
    <>
      <CreateEventDialog
        open={createDialogOpen}
        onClose={onCloseCreateDialog}
        onSave={onSaveEvent}
        eventToEdit={eventToEdit}
      />
      <ExportEventDialog
        open={exportDialogOpen}
        onClose={onCloseExportDialog}
        onExport={onExport}
        allEvents={combinedEvents}
        filteredEvents={filteredEvents}
        savedEventIds={savedEventIds}
      />
      <Snackbar open={toast.open} autoHideDuration={6000} onClose={onCloseToast}>
        <Alert onClose={onCloseToast} severity={toast.severity} sx={{ width: "100%" }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
});
