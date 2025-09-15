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
import { formatDateLine } from "../../utils/dateUtils";

interface EventDetailDialogProps {
  event: CalendarEvent | null;
  onClose: () => void;
  savedEventIds: string[];
  onToggleSaveEvent: (eventId: string) => void;
  onDeleteEvent: (eventId: string) => void;
  onEditEvent: (event: CalendarEvent) => void;
  timeZone: string;
}

function DetailItem({ icon, text }: { icon: React.ReactNode; text: string }) {
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
  timeZone,
}: EventDetailDialogProps) {
  const theme = useTheme();
  const [confirmOpen, setConfirmOpen] = useState(false);
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
    () => (event ? getColorForCategory(event.extendedProps.category, theme.palette.mode) : "default"),
    [event, theme.palette.mode]
  );

  const dateTimeDetails = useMemo(() => {
    if (!event) return null;

    const startDate = event.start;
    const endDate = event.end;
    const isSingleDay = startDate.toDateString() === endDate.toDateString();
    const timeZoneToUse = event.extendedProps.is_local_time ? undefined : timeZone;

    const startDateTimeText = formatDateLine(startDate, timeZoneToUse, true);
    const endDateTimeText = formatDateLine(endDate, timeZoneToUse, true);

    if (isSingleDay) {
      const dateText = formatDateLine(startDate, timeZoneToUse, false);
      const startTimeText = startDateTimeText?.split(",")[1];
      const endTimeText = endDateTimeText?.split(",")[1];
      const timeSuffix = event.extendedProps.is_local_time ? " (Local Time)" : "";
      return (
        <>
          <DetailItem icon={<CalendarTodayIcon color="action" />} text={dateText || ""} />
          <DetailItem
            icon={<AccessTimeIcon color="action" />}
            text={`${startTimeText} — ${endTimeText}${timeSuffix}`}
          />
        </>
      );
    }
    return (
      <>
        <DetailItem icon={<CalendarTodayIcon color="action" />} text={`Starts: ${startDateTimeText}`} />
        <DetailItem icon={<CalendarTodayIcon color="action" />} text={`Ends: ${endDateTimeText}`} />
      </>
    );
  }, [event, timeZone]);

  const handleDelete = useCallback(() => {
    if (!event) return;
    onDeleteEvent(event.extendedProps.article_url);
    setConfirmOpen(false);
    onClose();
  }, [event, onDeleteEvent, onClose]);

  if (!event) {
    return null;
  }

  const { extendedProps, title } = event;
  const { article_url, banner_url, category } = extendedProps;
  const isCustomEvent = category === "Custom Event";
  const isSaved = savedEventIds.includes(article_url);

  return (
    <>
      <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth disableRestoreFocus>
        <DialogContent sx={{ p: 0, position: "relative" }}>
          <IconButton
            aria-label={isSaved ? "Unsave event" : "Save event"}
            onClick={() => onToggleSaveEvent(article_url)}
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
            src={banner_url}
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
            <Stack spacing={2}>{dateTimeDetails}</Stack>
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
                href={article_url}
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
