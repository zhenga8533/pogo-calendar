import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useEffect, useState } from "react";
import type { NewEventData } from "../../hooks/useCustomEvents";
import type { CalendarEvent } from "../../types/events";

interface CreateEventDialogProps {
  open: boolean;
  eventToEdit?: CalendarEvent | null;
  onClose: () => void;
  onSave: (eventData: NewEventData, eventId?: string) => void;
}

/**
 * CreateEventDialog component to create a new custom calendar event.
 *
 * @param param0 Props containing open state, event to edit, and handlers.
 * @returns The CreateEventDialog component.
 */
function CreateEventDialog({ open, eventToEdit, onClose, onSave }: CreateEventDialogProps) {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState<Date | null>(new Date());
  const [end, setEnd] = useState<Date | null>(new Date());
  const [error, setError] = useState("");

  // Populate fields if editing an event
  useEffect(() => {
    if (eventToEdit) {
      setTitle(eventToEdit.title);
      setStart(eventToEdit.start);
      setEnd(eventToEdit.end);
    } else {
      setTitle("");
      setStart(new Date());
      setEnd(new Date());
      setError("");
    }
  }, [eventToEdit, open]);

  // Handle saving the new or edited event
  const handleSave = () => {
    if (!title || !start || !end) {
      setError("All fields are required.");
      return;
    }
    if (end < start) {
      setError("End date must be after the start date.");
      return;
    }
    onSave({ title, start, end }, eventToEdit?.extendedProps.article_url);
  };

  // Render the dialog component
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
        <DialogTitle>{eventToEdit ? "Edit Custom Event" : "Create Custom Event"}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              autoFocus
              label="Event Title"
              fullWidth
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={!!error}
              helperText={error}
            />
            <DateTimePicker label="Start Time" value={start} onChange={setStart} />
            <DateTimePicker label="End Time" value={end} onChange={setEnd} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}

export default CreateEventDialog;
