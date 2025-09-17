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
import React, { useCallback, useMemo, useState } from "react";
import { useEventStatus } from "../../hooks/useEventStatus";
import type { CalendarEvent } from "../../types/events";
import { downloadIcsFile } from "../../utils/calendarUtils";
import { getColorForCategory } from "../../utils/colorUtils";
import { formatDateLine, toDate } from "../../utils/dateUtils";

interface EventDetailDialogProps {
  event: CalendarEvent | null;
  onClose: () => void;
  savedEventIds: string[];
  timeZone: string;
  onToggleSaveEvent: (eventId: string) => void;
  onDeleteEvent: (eventId: string) => void;
  onEditEvent: (event: CalendarEvent) => void;
}

/**
 * Renders a single detail item with an icon and text.
 *
 * @param param0 Props for the DetailItem component.
 * @returns A single detail item with an icon and text.
 */
function DetailItem({ icon, text }: { icon: React.ReactNode; text: string | null }) {
  return (
    <Stack direction="row" spacing={1.5} alignItems="center">
      {icon}
      <Typography variant="body1">{text}</Typography>
    </Stack>
  );
}

/**
 * Renders a confirmation dialog for deleting an event.
 *
 * @param param0 Props for the DeleteConfirmationDialog component.
 * @returns A confirmation dialog for deleting an event.
 */
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

/**
 * A dialog component that displays detailed information about a calendar event.
 *
 * @param param0 Props for the EventDetailDialog component.
 * @returns A dialog displaying detailed information about a calendar event.
 */
function EventDetailDialog({
  event,
  onClose,
  savedEventIds,
  timeZone,
  onToggleSaveEvent,
  onDeleteEvent,
  onEditEvent,
}: EventDetailDialogProps) {
  const theme = useTheme();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const eventDetails = useMemo(() => {
    if (!event) return null;

    const startDate = toDate(event.start);
    const endDate = toDate(event.end);

    // If dates are invalid, we cannot render details
    if (!startDate || !endDate) return null;

    const eventId = event.extendedProps.article_url;

    return {
      id: eventId,
      title: event.title,
      category: event.extendedProps.category,
      bannerUrl: event.extendedProps.banner_url,
      startDate,
      endDate,
      isCustomEvent: event.extendedProps.category === "Custom Event",
      isSaved: savedEventIds.includes(eventId),
      isSingleDay: startDate.toDateString() === endDate.toDateString(),
    };
  }, [event, savedEventIds]);

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

  const dateTimeDetails = useMemo(() => {
    if (!eventDetails) return null;
    const { startDate, endDate, isSingleDay } = eventDetails;

    if (isSingleDay) {
      return (
        <>
          <DetailItem icon={<CalendarTodayIcon color="action" />} text={formatDateLine(startDate, false, timeZone)} />
          <DetailItem
            icon={<AccessTimeIcon color="action" />}
            text={`${formatDateLine(startDate, true, timeZone)?.split(" ")[3]} ${
              formatDateLine(startDate, true, timeZone)?.split(" ")[4]
            } — ${formatDateLine(endDate, true, timeZone)?.split(" ")[3]} ${
              formatDateLine(endDate, true, timeZone)?.split(" ")[4]
            }`}
          />
        </>
      );
    }

    return (
      <>
        <DetailItem
          icon={<CalendarTodayIcon color="action" />}
          text={`Starts: ${formatDateLine(startDate, true, timeZone)}`}
        />
        <DetailItem
          icon={<CalendarTodayIcon color="action" />}
          text={`Ends: ${formatDateLine(endDate, true, timeZone)}`}
        />
      </>
    );
  }, [eventDetails, timeZone]);

  // Callback to handle event deletion after confirmation.
  const handleDelete = useCallback(() => {
    if (!eventDetails) return;
    onDeleteEvent(eventDetails.id);
    setConfirmOpen(false);
    onClose();
  }, [eventDetails, onDeleteEvent, onClose]);

  // Render nothing if there is no event.
  if (!event || !eventDetails) {
    return null;
  }

  // Render the main event detail dialog.
  const { id, title, category, bannerUrl, isCustomEvent, isSaved } = eventDetails;
  return (
    <>
      <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth disableRestoreFocus>
        <DialogContent sx={{ p: 0, position: "relative" }}>
          {/* Save/Unsave Icon Button */}
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

          {/* Event Banner Image */}
          <Box
            component="img"
            src={bannerUrl}
            alt={`${title} banner`}
            sx={{ width: "100%", aspectRatio: "16 / 9", objectFit: "cover" }}
          />

          <Box sx={{ p: 3 }}>
            {/* Category and Status */}
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

            {/* Event Title */}
            <Typography variant="h5" component="h2" gutterBottom>
              {title}
            </Typography>

            {/* Divider */}
            <Divider sx={{ my: 2 }} />

            {/* Date and Time Details */}
            <Stack spacing={2}>{dateTimeDetails}</Stack>
          </Box>
        </DialogContent>

        {/* Dialog Actions */}
        <DialogActions sx={{ p: "16px 24px", justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
          {/* Calendar and Learn More Buttons */}
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

          {/* Action Buttons */}
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

      {/* Extracted Confirmation Dialog */}
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
