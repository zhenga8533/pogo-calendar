import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddToCalendarIcon from '@mui/icons-material/Event';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
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
} from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import { CUSTOM_EVENT_CATEGORY } from '../../config/constants';
import { useSettingsContext } from '../../contexts/SettingsContext';
import { useNoteEditor } from '../../hooks/useNoteEditor';
import type { ToastSeverity } from '../../hooks/useToast';
import type { CalendarEvent } from '../../types/events';
import { downloadIcsFile } from '../../utils/calendarUtils';
import { formatDateLine } from '../../utils/dateUtils';
import { CategoryTag } from '../shared/CategoryTag';
import { DeleteConfirmationDialog } from '../shared/DeleteConfirmationDialog';
import { EventStatusTag } from '../shared/EventStatusTag';
import { UnsavedChangesDialog } from '../shared/UnsavedChangesDialog';

// Merged DetailSection Component
interface DetailSectionProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}
function DetailSection({ title, children, icon }: DetailSectionProps) {
  return (
    <Stack spacing={1.5}>
      <Stack direction="row" spacing={1} alignItems="center">
        {icon}
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 700,
            fontSize: '1rem',
            color: 'text.primary',
          }}
        >
          {title}
        </Typography>
      </Stack>
      {children}
    </Stack>
  );
}

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
  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
    {items.map((item) => (
      <Chip
        key={item}
        label={item}
        size="small"
        sx={{
          borderRadius: '8px',
          fontWeight: 500,
          fontSize: '0.8125rem',
        }}
      />
    ))}
  </Box>
);

// Field name to display title mapping (optional custom titles)
const POKEMON_FIELD_TITLES: Record<string, string> = {
  features: 'Featured Pokémon',
  spawns: 'Wild Encounters',
  raids: 'Raid Battles',
  eggs: 'Egg Hatches',
  shiny: 'Available Shinies',
  shadow: 'Available Shadows',
  moves: 'Special Moves',
};

/**
 * Generates a display title for a Pokemon field.
 * Uses the mapping if available, otherwise generates from field name.
 * Example: "field_research" -> "Field Research"
 */
function getPokemonFieldTitle(fieldName: string): string {
  if (fieldName in POKEMON_FIELD_TITLES) {
    return POKEMON_FIELD_TITLES[fieldName];
  }

  // Auto-generate title: capitalize first letter and replace underscores with spaces
  return fieldName
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
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
  showToast,
}: EventDetailDialogProps) {
  const { settings } = useSettingsContext();
  const { hour12 } = settings;
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

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

  const onSaveNote = useCallback(
    (noteText: string) => {
      if (!eventDetails) return;
      onUpdateNote(eventDetails.id, noteText);
      showToast('Note saved successfully!', 'success');
    },
    [eventDetails, onUpdateNote, showToast]
  );

  const {
    noteText,
    isDirty,
    isUnsavedChangesDialogOpen,
    handleNoteChange,
    handleSave,
    handleClose,
    handleConfirmClose,
    closeUnsavedDialog,
  } = useNoteEditor(
    eventDetails ? eventNotes[eventDetails.id] || '' : '',
    onSaveNote,
    onClose
  );

  const handleDelete = useCallback(() => {
    if (!eventDetails) return;
    onDeleteEvent(eventDetails.id);
    setConfirmDeleteOpen(false);
    onClose();
  }, [eventDetails, onDeleteEvent, onClose]);

  if (!event || !eventDetails) {
    return null;
  }

  const {
    id,
    title,
    banner_url: bannerUrl,
    isCustomEvent,
    isSaved,
  } = eventDetails;

  return (
    <>
      <Dialog
        open={true}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        disableRestoreFocus
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3,
              boxShadow: (theme) => theme.shadows[12],
            },
          },
        }}
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          <IconButton
            aria-label={isSaved ? 'Unsave event' : 'Save event'}
            onClick={() => onToggleSaveEvent(id)}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              color: 'white',
              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.6)' },
              zIndex: 2,
            }}
          >
            {isSaved ? <StarIcon /> : <StarBorderIcon />}
          </IconButton>

          <Box
            component="img"
            src={bannerUrl}
            alt={`Event banner for ${title} - ${eventDetails.category} event`}
            sx={{
              width: '100%',
              aspectRatio: '16 / 9',
              objectFit: 'cover',
              maxHeight: '280px',
            }}
          />

          {/* Header section */}
          <Box
            sx={(theme) => ({
              borderBottom: `1px solid ${theme.palette.divider}`,
              p: 3,
              pb: 2.5,
            })}
          >
            <Stack spacing={2}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
                gap={1}
              >
                <CategoryTag category={eventDetails.category} />
                <EventStatusTag start={event.start} end={event.end} />
              </Stack>

              <Typography
                variant="h5"
                component="h2"
                sx={{
                  fontWeight: 700,
                  fontSize: '1.5rem',
                  lineHeight: 1.3,
                }}
              >
                {title}
              </Typography>

              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <CalendarTodayIcon
                    sx={{ fontSize: 20, color: 'primary.main' }}
                  />
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        color: 'text.secondary',
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                        fontSize: '0.7rem',
                        display: 'block',
                      }}
                    >
                      Start Time
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 500, color: 'text.primary' }}
                    >
                      {eventDetails.start}
                    </Typography>
                  </Box>
                </Stack>

                {eventDetails.end && (
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <AccessTimeIcon
                      sx={{ fontSize: 20, color: 'secondary.main' }}
                    />
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 600,
                          color: 'text.secondary',
                          textTransform: 'uppercase',
                          letterSpacing: 0.5,
                          fontSize: '0.7rem',
                          display: 'block',
                        }}
                      >
                        End Time
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 500, color: 'text.primary' }}
                      >
                        {eventDetails.end}
                      </Typography>
                    </Box>
                  </Stack>
                )}
              </Stack>
            </Stack>
          </Box>

          {/* Content section */}
          <Box sx={{ p: 3 }}>
            <Stack spacing={3} divider={<Divider />}>
              {eventDetails.description && (
                <DetailSection title="Description">
                  <Stack spacing={0.75}>
                    {eventDetails.description.split('\n').map((line, index) => {
                      const trimmedLine = line.trim();
                      if (!trimmedLine) return null;
                      // Replace "- " with "• " for list items
                      const displayText = trimmedLine.startsWith('- ')
                        ? '• ' + trimmedLine.substring(2)
                        : trimmedLine;
                      return (
                        <Typography
                          key={index}
                          variant="body1"
                          sx={{ lineHeight: 1.7 }}
                        >
                          {displayText}
                        </Typography>
                      );
                    })}
                  </Stack>
                </DetailSection>
              )}

              {eventDetails.bonuses && eventDetails.bonuses.length > 0 && (
                <DetailSection title="Event Bonuses">
                  <Stack spacing={0.75}>
                    {eventDetails.bonuses.map((bonus) => (
                      <Typography
                        key={bonus}
                        variant="body2"
                        sx={{ lineHeight: 1.6, pl: 1 }}
                      >
                        • {bonus}
                      </Typography>
                    ))}
                  </Stack>
                </DetailSection>
              )}

              {/* Dynamically render all Pokemon-related fields */}
              {Object.entries(eventDetails)
                .filter(([key, value]) => {
                  // Exclude known non-Pokemon fields and only show arrays with content
                  const nonPokemonFields = [
                    'category',
                    'article_url',
                    'banner_url',
                    'description',
                    'bonuses',
                    'id',
                    'title',
                    'isCustomEvent',
                    'isSaved',
                    'start',
                    'end',
                  ];
                  return (
                    !nonPokemonFields.includes(key) &&
                    Array.isArray(value) &&
                    value.length > 0
                  );
                })
                .map(([key, value]) => (
                  <DetailSection key={key} title={getPokemonFieldTitle(key)}>
                    <ChipList items={value as string[]} />
                  </DetailSection>
                ))}

              <DetailSection title="Notes">
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  placeholder="Add your personal notes here..."
                  value={noteText}
                  onChange={(e) => handleNoteChange(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </DetailSection>
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            p: 2,
            flexDirection: { xs: 'column-reverse', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Stack
            direction="row"
            gap={1}
            flexWrap="wrap"
            justifyContent={{ xs: 'center', sm: 'flex-start' }}
          >
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
            <Button
              variant="outlined"
              startIcon={<AddToCalendarIcon />}
              onClick={() =>
                downloadIcsFile(event, (error) => showToast(error, 'error'))
              }
            >
              Add to Calendar
            </Button>
          </Stack>
          <Stack
            direction="row"
            gap={1}
            flexWrap="wrap"
            justifyContent={{ xs: 'center', sm: 'flex-end' }}
          >
            {isCustomEvent && (
              <>
                <Button
                  onClick={() => onEditEvent(event)}
                  startIcon={<EditIcon />}
                >
                  Edit
                </Button>
                <Button
                  onClick={() => setConfirmDeleteOpen(true)}
                  color="error"
                  startIcon={<DeleteIcon />}
                >
                  Delete
                </Button>
              </>
            )}
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={!isDirty}
            >
              Save
            </Button>
            <Button onClick={handleClose}>Close</Button>
          </Stack>
        </DialogActions>
      </Dialog>
      <DeleteConfirmationDialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={handleDelete}
        eventName={title}
      />
      <UnsavedChangesDialog
        open={isUnsavedChangesDialogOpen}
        onClose={closeUnsavedDialog}
        onConfirm={handleConfirmClose}
      />
    </>
  );
}

export default EventDetailDialog;
