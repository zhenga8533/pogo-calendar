import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useCallback, useEffect, useState } from "react";
import type { CalendarEvent, NewEventData } from "../../types/events";
import { UnsavedChangesDialog } from "../shared/UnsavedChangesDialog";

interface CreateEventDialogProps {
  open: boolean;
  eventToEdit?: CalendarEvent | null;
  onClose: () => void;
  onSave: (eventData: NewEventData, eventId?: string) => void;
}

const getInitialFormData = () => ({
  title: "",
  start: "",
  end: "",
});

const getInitialErrors = () => ({
  title: null as string | null,
  end: null as string | null,
});

function CreateEventDialog({ open, eventToEdit, onClose, onSave }: CreateEventDialogProps) {
  const [formData, setFormData] = useState(getInitialFormData());
  const [errors, setErrors] = useState(getInitialErrors());
  const [isDirty, setIsDirty] = useState(false);
  const [isUnsavedChangesDialogOpen, setUnsavedChangesDialogOpen] = useState(false);

  useEffect(() => {
    if (open) {
      if (eventToEdit) {
        setFormData({
          title: eventToEdit.title,
          start: eventToEdit.start,
          end: eventToEdit.end,
        });
      } else {
        setFormData(getInitialFormData());
      }
      setErrors(getInitialErrors());
      setIsDirty(false);
    }
  }, [eventToEdit, open]);

  const handleChange = useCallback(
    (field: keyof typeof formData, value: any) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setIsDirty(true);
      if (errors.title && field === "title") {
        setErrors((prev) => ({ ...prev, title: null }));
      }
      if (errors.end && (field === "start" || field === "end")) {
        setErrors((prev) => ({ ...prev, end: null }));
      }
    },
    [errors.title, errors.end]
  );

  const validateForm = () => {
    const newErrors = getInitialErrors();
    let isValid = true;

    if (!formData.title.trim()) {
      newErrors.title = "Event title is required.";
      isValid = false;
    }
    if (!formData.start || !formData.end) {
      newErrors.end = "Start and end times are required.";
      isValid = false;
    } else if (new Date(formData.end) < new Date(formData.start)) {
      newErrors.end = "End time must be after the start time.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = useCallback(() => {
    if (validateForm()) {
      onSave(formData, eventToEdit?.extendedProps.article_url);
      setIsDirty(false);
    }
  }, [formData, eventToEdit, onSave]);

  const handleClose = () => {
    if (isDirty) {
      setUnsavedChangesDialogOpen(true);
    } else {
      onClose();
    }
  };

  const handleConfirmClose = () => {
    setUnsavedChangesDialogOpen(false);
    onClose();
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
          <DialogTitle>{eventToEdit ? "Edit Custom Event" : "Create Custom Event"}</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                autoFocus
                label="Event Title"
                fullWidth
                variant="outlined"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                error={!!errors.title}
                helperText={errors.title}
              />
              <DateTimePicker
                label="Start Time"
                value={(formData.start && new Date(formData.start)) || null}
                onChange={(newValue) => handleChange("start", newValue)}
              />
              <DateTimePicker
                label="End Time"
                value={(formData.end && new Date(formData.end)) || null}
                onChange={(newValue) => handleChange("end", newValue)}
                slotProps={{
                  textField: {
                    error: !!errors.end,
                    helperText: errors.end,
                  },
                }}
              />
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
      <UnsavedChangesDialog
        open={isUnsavedChangesDialogOpen}
        onClose={() => setUnsavedChangesDialogOpen(false)}
        onConfirm={handleConfirmClose}
      />
    </>
  );
}

export default CreateEventDialog;
