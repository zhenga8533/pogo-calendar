import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useState } from "react";
import type { NewEventData } from "../../hooks/useCustomEvents";

interface CreateEventDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (eventData: NewEventData) => void;
}

/**
 * CreateEventDialog component to create a new custom calendar event.
 *
 * @param param0 Props for the CreateEventDialog component.
 * @returns The CreateEventDialog component.
 */
function CreateEventDialog({ open, onClose, onSave }: CreateEventDialogProps) {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState<Date | null>(new Date());
  const [end, setEnd] = useState<Date | null>(new Date());
  const [error, setError] = useState("");

  // Handle saving the new event
  const handleSave = () => {
    if (!title || !start || !end) {
      setError("All fields are required.");
      return;
    }
    if (end < start) {
      setError("End date must be after the start date.");
      return;
    }
    onSave({ title, start, end });
    handleClose();
  };

  // Handle closing the dialog and resetting state
  const handleClose = () => {
    setTitle("");
    setStart(new Date());
    setEnd(new Date());
    setError("");
    onClose();
  };

  // Render the dialog component
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>Create Custom Event</DialogTitle>
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
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}

export default CreateEventDialog;
