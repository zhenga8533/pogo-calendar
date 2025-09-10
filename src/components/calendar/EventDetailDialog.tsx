import AccessTimeIcon from "@mui/icons-material/AccessTime";
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
import React, { useState } from "react";
import { useEventStatus } from "../../hooks/useEventStatus"; // New import for the hook
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

/**
 * DetailItem component to display an icon and text in a row.
 *
 * @param {object} props Props containing icon and text for the detail item.
 * @returns {React.ReactElement} The rendered DetailItem component.
 */
function DetailItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <Stack direction="row" spacing={1.5} alignItems="center">
      {icon}
      <Typography variant="body1">{text}</Typography>
    </Stack>
  );
}

/**
 * EventDetailDialog component to display detailed information about a calendar event.
 *
 * @param {EventDetailDialogProps} props Props containing the event data and various event handlers.
 * @returns {React.ReactElement | null} The rendered EventDetailDialog component or null if no event is provided.
 */
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

  // Use the new hook to get event status and display time
  const { status, displayTime } = useEventStatus(event?.start ?? null, event?.end ?? null);

  if (!event) {
    return null;
  }

  // Handle deletion confirmation
  const handleDelete = () => {
    onDeleteEvent(event.extendedProps.article_url);
    setConfirmOpen(false);
    onClose();
  };

  const isCustomEvent = event.extendedProps.category === "Custom Event";
  const isSaved = savedEventIds.includes(event.extendedProps.article_url);
  const startDate = new Date(event.start!);
  const endDate = new Date(event.end!);
  const isSingleDay = startDate.toDateString() === endDate.toDateString();

  // Date and time formatting options
  const dateOptions: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  };

  const combinedDateTimeOptions: Intl.DateTimeFormatOptions = { ...dateOptions, ...timeOptions };

  // Define status label and color for the custom status tag
  const statusInfo = {
    active: { label: "Active Now", color: theme.palette.success.main, prefix: "Ends in:" },
    upcoming: { label: "Upcoming", color: theme.palette.warning.main, prefix: "Starts in:" },
    finished: { label: "Finished", color: theme.palette.action.disabled, prefix: "" }, // No prefix needed for finished
  };

  // Render the dialog with event details
  return (
    <>
      <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth disableRestoreFocus>
        <DialogContent sx={{ p: 0, position: "relative" }}>
          {/* Save/Unsave Button */}
          <IconButton
            onClick={() => onToggleSaveEvent(event.extendedProps.article_url)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.6)",
              },
              zIndex: 1, // Ensure it's above the image
            }}
          >
            {isSaved ? <StarIcon /> : <StarBorderIcon />}
          </IconButton>

          {/* Event Banner Image */}
          <Box
            component="img"
            src={event.extendedProps.banner_url}
            alt={`${event.title} banner`}
            sx={{
              width: "100%",
              aspectRatio: "16 / 9",
              objectFit: "cover",
            }}
          />

          <Box sx={{ p: 3 }}>
            {/* Event Category Chip */}
            <Chip
              label={event.extendedProps.category}
              sx={{
                mb: 2, // Spacing below the category chip
                backgroundColor: getColorForCategory(event.extendedProps.category, theme.palette.mode),
                color: theme.palette.getContrastText(
                  getColorForCategory(event.extendedProps.category, theme.palette.mode)
                ),
                fontWeight: "bold",
              }}
            />

            {/* Event Title */}
            <Typography variant="h5" component="div" gutterBottom>
              {event.title}
            </Typography>

            {/* New section for Status and Dynamic Time */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              {/* Status Tag (Left) */}
              <Box
                sx={{
                  backgroundColor: statusInfo[status].color,
                  color: theme.palette.getContrastText(statusInfo[status].color),
                  borderRadius: "4px",
                  px: 1.5,
                  py: 0.5,
                  fontSize: "0.875rem",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                {statusInfo[status].label}
                {displayTime && ( // Only show time if it's not empty
                  <Typography variant="caption" color="inherit" component="span" sx={{ ml: 0.5 }}>
                    {statusInfo[status].prefix} {displayTime}
                  </Typography>
                )}
              </Box>
            </Stack>

            <Divider sx={{ my: 2 }} />

            {/* Date and Time Details */}
            <Stack spacing={2}>
              {isSingleDay ? (
                <>
                  <DetailItem
                    icon={<CalendarTodayIcon color="action" />}
                    text={startDate.toLocaleDateString("en-US", dateOptions)}
                  />
                  <DetailItem
                    icon={<AccessTimeIcon color="action" />}
                    text={`${startDate.toLocaleTimeString("en-US", timeOptions)} — ${endDate.toLocaleTimeString(
                      "en-US",
                      timeOptions
                    )}`}
                  />
                </>
              ) : (
                <>
                  <DetailItem
                    icon={<CalendarTodayIcon color="action" />}
                    text={`Starts: ${startDate.toLocaleString("en-US", combinedDateTimeOptions)}`}
                  />
                  <DetailItem
                    icon={<CalendarTodayIcon color="action" />}
                    text={`Ends: ${endDate.toLocaleString("en-US", combinedDateTimeOptions)}`}
                  />
                </>
              )}
            </Stack>
          </Box>
        </DialogContent>

        {/* Dialog Actions (Edit, Delete, Close, Add to Calendar, Learn More) */}
        <DialogActions sx={{ p: "16px 24px", justifyContent: "space-between" }}>
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
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button onClick={onClose}>Close</Button>
            <Button variant="outlined" startIcon={<AddToCalendarIcon />} onClick={() => downloadIcsFile(event)}>
              Add to Calendar
            </Button>
            {!isCustomEvent && (
              <Button
                component={Link}
                href={event.extendedProps.article_url}
                target="_blank"
                rel="noopener noreferrer"
                variant="contained"
                endIcon={<OpenInNewIcon />}
              >
                Learn More
              </Button>
            )}
          </Box>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} disableRestoreFocus>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the event "{event.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default EventDetailDialog;
