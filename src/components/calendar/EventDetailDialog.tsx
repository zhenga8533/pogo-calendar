import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
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
import type { CalendarEvent } from "../../types/events";
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

  // Render the dialog with event details
  return (
    <>
      <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth disableRestoreFocus>
        <DialogContent sx={{ p: 0, position: "relative" }}>
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
            }}
          >
            {isSaved ? <StarIcon /> : <StarBorderIcon />}
          </IconButton>

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
            <Chip
              label={event.extendedProps.category}
              sx={{
                mb: 2,
                backgroundColor: getColorForCategory(event.extendedProps.category, theme.palette.mode),
                color: theme.palette.getContrastText(
                  getColorForCategory(event.extendedProps.category, theme.palette.mode)
                ),
                fontWeight: "bold",
              }}
            />
            <Typography variant="h5" component="div" gutterBottom>
              {event.title}
            </Typography>
            <Divider sx={{ my: 2 }} />
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
        <DialogActions sx={{ p: "16px 24px", justifyContent: "space-between" }}>
          <Box>
            {isCustomEvent && (
              <>
                <Button onClick={() => onEditEvent(event)} color="primary" startIcon={<EditIcon />}>
                  Edit
                </Button>
                <Button onClick={() => setConfirmOpen(true)} color="error" startIcon={<DeleteIcon />}>
                  Delete
                </Button>
              </>
            )}
          </Box>
          <Box>
            <Button onClick={onClose}>Close</Button>
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
