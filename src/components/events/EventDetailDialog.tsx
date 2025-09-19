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
  Divider,
  IconButton,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CUSTOM_EVENT_CATEGORY } from "../../config/constants";
import { useSettingsContext } from "../../contexts/SettingsContext";
import type { ToastSeverity } from "../../hooks/useToast";
import type { CalendarEvent } from "../../types/events";
import { downloadIcsFile } from "../../utils/calendarUtils";
import { formatDateLine } from "../../utils/dateUtils";
import { CategoryTag } from "../shared/CategoryTag";
import { DeleteConfirmationDialog } from "../shared/DeleteConfirmationDialog";
import { EventStatusTag } from "../shared/EventStatusTag";
import { UnsavedChangesDialog } from "../shared/UnsavedChangesDialog";

// --- Merged DetailSection Component ---
interface DetailSectionProps {
  title: string;
  children: React.ReactNode;
}

function DetailSection({ title, children }: DetailSectionProps) {
  return (
    <Stack spacing={1.5}>
      <Typography variant="h6" component="h3" fontWeight="bold">
        {title}
      </Typography>
      {children}
      <Divider sx={{ pt: 1 }} />
    </Stack>
  );
}
// ------------------------------------

interface EventDetailDialogProps {
  event: CalendarEvent | null;
  onClose: () => void;
  savedEventIds: string[];
  onToggleSaveEvent: (eventId: string) => void;
  onDeleteEvent: (eventId: string) => void;
  onUpdateNote: (eventId: string, noteText: string) => void;
  eventNotes: Record<string, string>;
  onEditEvent: (event: CalendarEvent) => void;
  showToast: (message: string, severity?: ToastSeverity) => void;
}

const ChipList = ({ items }: { items: string[] }) => (
  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
    {items.map((item) => (
      <Chip key={item} label={item} />
    ))}
  </Box>
);

function EventDetailDialog({
  event,
  onClose,
  savedEventIds,
  onToggleSaveEvent,
  onDeleteEvent,
  onEditEvent,
  onUpdateNote,
  eventNotes,
  showToast,
}: EventDetailDialogProps) {
  const { settings } = useSettingsContext();
  const { hour12 } = settings;
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [isUnsavedChangesDialogOpen, setUnsavedChangesDialogOpen] = useState(false);

  const eventDetails = useMemo(() => {
    if (!event) return null;
    return {
      ...event.extendedProps,
      id: event.extendedProps.article_url,
      title: event.title,
      isCustomEvent: event.extendedProps.category === CUSTOM_EVENT_CATEGORY,
      isSaved: savedEventIds.includes(event.extendedProps.article_url),
      start: formatDateLine(event.start, hour12),
      end: event.end ? formatDateLine(event.end, hour12) : null,
    };
  }, [event, savedEventIds, hour12]);

  useEffect(() => {
    if (eventDetails) {
      setNoteText(eventNotes[eventDetails.id] || "");
      setIsDirty(false);
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
    setIsDirty(false);
    showToast("Note saved successfully!", "success");
    onClose();
  }, [eventDetails, noteText, onUpdateNote, showToast, onClose]);

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

  if (!event || !eventDetails) {
    return null;
  }

  const { id, title, banner_url: bannerUrl, isCustomEvent, isSaved } = eventDetails;

  return (
    <>
      <Dialog
        open={true}
        onClose={handleClose}
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
            sx={{ width: "100%", aspectRatio: "16 / 9", objectFit: "cover" }}
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

            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
              <CalendarTodayIcon color="action" />
              <Typography variant="body1">
                {eventDetails.start} - {eventDetails.end}
              </Typography>
            </Stack>
            <Divider sx={{ my: 2 }} />

            <Stack spacing={3}>
              {eventDetails.description && (
                <DetailSection title="Description">
                  <Typography variant="body1">{eventDetails.description}</Typography>
                </DetailSection>
              )}

              {eventDetails.bonuses && eventDetails.bonuses.length > 0 && (
                <DetailSection title="Event Bonuses">
                  <Stack spacing={1}>
                    {eventDetails.bonuses.map((bonus) => (
                      <Typography key={bonus} variant="body1">
                        • {bonus}
                      </Typography>
                    ))}
                  </Stack>
                </DetailSection>
              )}

              {eventDetails.features && eventDetails.features.length > 0 && (
                <DetailSection title="Featured Pokémon">
                  <ChipList items={eventDetails.features} />
                </DetailSection>
              )}

              {eventDetails.spawns && eventDetails.spawns.length > 0 && (
                <DetailSection title="Wild Encounters">
                  <ChipList items={eventDetails.spawns} />
                </DetailSection>
              )}

              {eventDetails.raids && eventDetails.raids.length > 0 && (
                <DetailSection title="Raids">
                  <ChipList items={eventDetails.raids} />
                </DetailSection>
              )}

              {eventDetails.eggs && eventDetails.eggs.length > 0 && (
                <DetailSection title="Eggs">
                  <ChipList items={eventDetails.eggs} />
                </DetailSection>
              )}

              {eventDetails.shiny && eventDetails.shiny.length > 0 && (
                <DetailSection title="Shiny Debuts">
                  <ChipList items={eventDetails.shiny} />
                </DetailSection>
              )}

              {eventDetails.shadow && eventDetails.shadow.length > 0 && (
                <DetailSection title="New Shadow Pokémon">
                  <ChipList items={eventDetails.shadow} />
                </DetailSection>
              )}

              <DetailSection title="Notes">
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  placeholder="Add your personal notes here..."
                  value={noteText}
                  onChange={(e) => {
                    setNoteText(e.target.value);
                    setIsDirty(true);
                  }}
                />
              </DetailSection>
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            p: 2,
            flexDirection: { xs: "column-reverse", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Stack direction="row" gap={1} flexWrap="wrap" justifyContent={{ xs: "center", sm: "flex-start" }}>
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
            <Button variant="outlined" startIcon={<AddToCalendarIcon />} onClick={() => downloadIcsFile(event)}>
              Add to Calendar
            </Button>
          </Stack>
          <Stack direction="row" gap={1} flexWrap="wrap" justifyContent={{ xs: "center", sm: "flex-end" }}>
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
            <Button variant="contained" onClick={handleSave} disabled={!isDirty}>
              Save
            </Button>
            <Button onClick={handleClose}>Close</Button>
          </Stack>
        </DialogActions>
      </Dialog>
      <DeleteConfirmationDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        eventName={title}
      />
      <UnsavedChangesDialog
        open={isUnsavedChangesDialogOpen}
        onClose={() => setUnsavedChangesDialogOpen(false)}
        onConfirm={handleConfirmClose}
      />
    </>
  );
}

export default EventDetailDialog;
