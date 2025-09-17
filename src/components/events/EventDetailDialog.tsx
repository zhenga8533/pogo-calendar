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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import type { CalendarEvent } from "../../types/events";
import { downloadIcsFile } from "../../utils/calendarUtils";
import { formatDateLine } from "../../utils/dateUtils";
import { CategoryTag } from "../shared/CategoryTag";
import { EventStatusTag } from "../shared/EventStatusTag";

interface EventDetailDialogProps {
  event: CalendarEvent | null;
  onClose: () => void;
  savedEventIds: string[];
  onToggleSaveEvent: (eventId: string) => void;
  onDeleteEvent: (eventId: string) => void;
  onUpdateNote: (eventId: string, noteText: string) => void;
  eventNotes: Record<string, string>;
  onEditEvent: (event: CalendarEvent) => void;
  hour12: boolean;
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
  onUpdateNote,
  eventNotes,
  hour12,
}: EventDetailDialogProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [noteText, setNoteText] = useState("");

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
      start: formatDateLine(event.start, hour12),
      end: event.end ? formatDateLine(event.end, hour12) : null,
    };
  }, [event, savedEventIds, hour12]);

  useEffect(() => {
    if (eventDetails) {
      setNoteText(eventNotes[eventDetails.id] || "");
    }
  }, [eventDetails, eventNotes]);

  const handleDelete = useCallback(() => {
    if (!eventDetails) return;
    onDeleteEvent(eventDetails.id);
    setConfirmOpen(false);
    onClose();
  }, [eventDetails, onDeleteEvent, onClose]);

  const handleSave = useCallback(() => {
    if (!eventDetails) return;
    onUpdateNote(eventDetails.id, noteText);
  }, [eventDetails, noteText, onUpdateNote]);

  if (!event || !eventDetails) {
    return null;
  }

  const { id, title, bannerUrl, isCustomEvent, isSaved } = eventDetails;

  return (
    <>
      <Dialog
        open={true}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        disableRestoreFocus
        PaperProps={{ sx: { borderRadius: 4 } }}
      >
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
              zIndex: 2,
            }}
          >
            {isSaved ? <StarIcon /> : <StarBorderIcon />}
          </IconButton>

          <Box
            component="img"
            src={bannerUrl}
            alt={`${title} banner`}
            sx={{
              width: "100%",
              aspectRatio: "16 / 9",
              objectFit: "cover",
            }}
          />

          <Box sx={{ p: 3, position: "relative", zIndex: 1, backgroundColor: "background.paper" }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}
            >
              <CategoryTag category={eventDetails.category} />
              <EventStatusTag start={event.start} end={event.end} />
            </Stack>

            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: "bold" }}>
              {title}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Stack spacing={3}>
              <Stack spacing={2}>
                <DetailItem icon={<CalendarTodayIcon color="action" />} text={`Start: ${eventDetails.start}`} />
                {event.end && (
                  <DetailItem icon={<CalendarTodayIcon color="action" />} text={`End: ${eventDetails.end}`} />
                )}
              </Stack>
              <Stack spacing={2}>
                <Typography variant="subtitle1" component="h3" fontWeight="bold">
                  Notes
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  placeholder="Add your personal notes here..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                />
              </Stack>
            </Stack>
          </Box>
        </DialogContent>

        <Divider />
        <DialogActions
          sx={{
            p: 2,
            flexDirection: { xs: "column-reverse", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Stack
            direction="row"
            gap={1}
            flexWrap="wrap"
            justifyContent={{ xs: "center", sm: "flex-start" }}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            {!isCustomEvent && (
              <Button
                component={Link}
                href={id}
                target="_blank"
                rel="noopener noreferrer"
                variant="contained"
                endIcon={<OpenInNewIcon />}
                sx={{ whiteSpace: "nowrap" }}
              >
                Learn More
              </Button>
            )}
            <Button
              variant="outlined"
              startIcon={<AddToCalendarIcon />}
              onClick={() => downloadIcsFile(event)}
              sx={{ whiteSpace: "nowrap" }}
            >
              Add to Calendar
            </Button>
          </Stack>

          <Stack
            direction="row"
            gap={1}
            flexWrap="wrap"
            justifyContent={{ xs: "center", sm: "flex-end" }}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
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
            <Button variant="contained" onClick={handleSave} sx={{ whiteSpace: "nowrap" }}>
              Save
            </Button>
            <Button onClick={onClose}>Close</Button>
          </Stack>
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
