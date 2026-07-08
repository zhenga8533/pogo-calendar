import { useCallback, useEffect, useState } from 'react';
import type { CalendarEvent, NewEventData } from '../../types/events';
import { formatToLocalTime } from '../../utils/dateUtils';
import { UnsavedChangesDialog } from '../shared/UnsavedChangesDialog';
import { Button } from '../ui/button';
import { DateTimePickerField } from '../ui/date-picker';
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface CreateEventDialogProps {
  open: boolean;
  eventToEdit?: CalendarEvent | null;
  onClose: () => void;
  onSave: (eventData: NewEventData, eventId?: string) => void;
}

const getInitialFormData = (): NewEventData => ({
  title: '',
  start: '',
  end: '',
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
    <K extends keyof NewEventData>(field: K, value: NewEventData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setIsDirty(true);
      if (errors.title && field === 'title') {
        setErrors((prev) => ({ ...prev, title: null }));
      }
      if (errors.end && (field === 'start' || field === 'end')) {
        setErrors((prev) => ({ ...prev, end: null }));
      }
    },
    [errors.title, errors.end]
  );

  const validateForm = () => {
    const newErrors = getInitialErrors();
    let isValid = true;

    if (!formData.title.trim()) {
      newErrors.title = 'Event title is required.';
      isValid = false;
    }
    if (!formData.start || !formData.end) {
      newErrors.end = 'Start and end times are required.';
      isValid = false;
    } else if (new Date(formData.end) < new Date(formData.start)) {
      newErrors.end = 'End time must be after the start time.';
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
      <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{eventToEdit ? 'Edit Custom Event' : 'Create Custom Event'}</DialogTitle>
          </DialogHeader>
          <DialogBody className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="event-title">Event Title</Label>
              <Input
                id="event-title"
                autoFocus
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
              />
              {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Start Time</Label>
              <DateTimePickerField
                value={(formData.start && new Date(formData.start)) || null}
                onChange={(newValue) => handleChange('start', newValue ? formatToLocalTime(newValue) : '')}
              />
            </div>
            <div className="space-y-1.5">
              <Label>End Time</Label>
              <DateTimePickerField
                value={(formData.end && new Date(formData.end)) || null}
                onChange={(newValue) => handleChange('end', newValue ? formatToLocalTime(newValue) : '')}
              />
              {errors.end && <p className="text-xs text-destructive">{errors.end}</p>}
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <UnsavedChangesDialog
        open={isUnsavedChangesDialogOpen}
        onClose={() => setUnsavedChangesDialogOpen(false)}
        onConfirm={handleConfirmClose}
      />
    </>
  );
}

export default CreateEventDialog;
