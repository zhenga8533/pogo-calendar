import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddToCalendarIcon from "@mui/icons-material/Event";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  Link,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useCallback, useMemo, useState } from "react";
import { useEventStatus } from "../../hooks/useEventStatus";
import type { CalendarEvent } from "../../types/events";
import { downloadIcsFile } from "../../utils/calendarUtils";
import { getColorForCategory } from "../../utils/colorUtils";

interface EventDetailDialogProps {
  event: CalendarEvent | null;
  onClose: () => void;
  savedEventIds: string[];
  onToggleSaveEvent: (eventId: string) => void;
  onDeleteEvent: (eventId: string) => void;
  onEditEvent: (event: CalendarEvent) => void;
}

function DetailItem({ icon, text }: { icon: React.ReactNode; text: string | null }) {
  return (
    <Stack direction="row" spacing={1.5} alignItems="center">
      {icon}
      <Typography variant="body1">{text}</Typography>
    </Stack>
  );
}

function DeleteConfirmationDialog({
  open,
  onClose,
  onConfirm,
  eventName,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  eventName: string;
}) {
  return (
    <Dialog open={open} onClose={onClose} disableRestoreFocus>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete the event "{eventName}"? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function EventDetailDialog({
  event,
  onClose,
  savedEventIds,
  onToggleSaveEvent,
  onDeleteEvent,
  onEditEvent,
}: EventDetailDialogProps) {
  const theme = useTheme();
  const [confirmOpen, setConfirmOpen] = useState(false);

  // The event object is now your original event with string dates
  const eventDetails = useMemo(() => {
    if (!event) return null;

    const eventId = event.extendedProps.article_url;
    return {
      id: eventId,
      title: event.title,
      category: event.extendedProps.category,
      bannerUrl: event.extendedProps.banner_url,
      isCustomEvent: event.extendedProps.category === "Custom Event",
      isSaved: savedEventIds.includes(eventId),
    };
  }, [event, savedEventIds]);

  // Pass the string dates to the useEventStatus hook.
  const { status, displayTime } = useEventStatus(event?.start ?? null, event?.end ?? null);

  const statusInfo = useMemo(
    () => ({
      active: { label: "Active Now", color: theme.palette.success.main },
      upcoming: { label: "Upcoming", color: theme.palette.warning.main },
      finished: { label: "Finished", color: theme.palette.text.secondary },
      loading: { label: "Loading...", color: theme.palette.action.disabledBackground },
    }),
    [theme]
  );

  const categoryColor = useMemo(
    () => (eventDetails ? getColorForCategory(eventDetails.category, theme.palette.mode) : "default"),
    [eventDetails, theme.palette.mode]
  );

  const handleDelete = useCallback(() => {
    if (!eventDetails) return;
    onDeleteEvent(eventDetails.id);
    setConfirmOpen(false);
    onClose();
  }, [eventDetails, onDeleteEvent, onClose]);

  if (!event || !eventDetails) {
    return null;
  }

  const { id, title, category, bannerUrl, isCustomEvent, isSaved } = eventDetails;
  return (
    <>
      <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth disableRestoreFocus>
        <DialogContent sx={{ p: 0, position: "relative" }}>
          <IconButton
            aria-label={isSaved ? "Unsave event" : "Save event"}
            onClick={() => onToggleSaveEvent(id)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              color: "white",
              "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.6)" },
              zIndex: 1,
            }}
          >
            {isSaved ? <StarIcon /> : <StarBorderIcon />}
          </IconButton>

          <Box
            component="img"
            src={bannerUrl}
            alt={`${title} banner`}
            sx={{ width: "100%", aspectRatio: "16 / 9", objectFit: "cover" }}
          />

          <Box sx={{ p: 3 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}
            >
              <Chip
                label={category}
                sx={{
                  backgroundColor: categoryColor,
                  color: theme.palette.getContrastText(categoryColor),
                  fontWeight: "bold",
                }}
              />
              <Box
                sx={{
                  backgroundColor: statusInfo[status].color,
                  color: theme.palette.getContrastText(statusInfo[status].color),
                  borderRadius: "4px",
                  px: 1.5,
                  py: 0.5,
                  fontSize: "0.875rem",
                  fontWeight: "bold",
                }}
              >
                {statusInfo[status].label}
                {displayTime && ` (${displayTime})`}
              </Box>
            </Stack>

            <Typography variant="h5" component="h2" gutterBottom>
              {title}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Stack spacing={2}>
              {/* Use the string values directly */}
              <DetailItem icon={<CalendarTodayIcon color="action" />} text={`Start: ${event.start}`} />
              {event.end && <DetailItem icon={<CalendarTodayIcon color="action" />} text={`End: ${event.end}`} />}
            </Stack>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: "16px 24px", justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Button variant="outlined" startIcon={<AddToCalendarIcon />} onClick={() => downloadIcsFile(event)}>
              Add to Calendar
            </Button>
            {!isCustomEvent && (
              <Button
                component={Link}
                href={id}
                target="_blank"
                rel="noopener noreferrer"
                variant="contained"
                endIcon={<OpenInNewIcon />}
              >
                Learn More
              </Button>
            )}
          </Box>

          <Box>
            {isCustomEvent && (
              <>
                <Button onClick={() => onEditEvent(event)} startIcon={<EditIcon />}>
                  Edit
                </Button>
                <Button onClick={() => setConfirmOpen(true)} color="error" startIcon={<DeleteIcon />}>
                  Delete
                </Button>
              </>
            )}
            <Button onClick={onClose}>Close</Button>
          </Box>
        </DialogActions>
      </Dialog>

      <DeleteConfirmationDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        eventName={title}
      />
    </>
  );
}

export default EventDetailDialog;
