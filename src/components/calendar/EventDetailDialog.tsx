import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
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
  Typography,
} from "@mui/material";
import React from "react";
import type { CalendarEvent } from "../../types/events";
import { getColorForCategory } from "../../utils/colorUtils";

interface EventDetailDialogProps {
  event: CalendarEvent | null;
  onClose: () => void;
  savedEventIds: string[];
  onToggleSaveEvent: (eventId: string) => void;
}

/**
 * DetailItem component to display an icon and text in a row.
 *
 * @param param0 Props containing icon and text for the detail item.
 * @returns The rendered DetailItem component.
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
 * @param param0 Props containing event details, close handler, saved event IDs, and toggle function.
 * @returns The rendered EventDetailDialog component or null if no event is provided.
 */
function EventDetailDialog({ event, onClose, savedEventIds, onToggleSaveEvent }: EventDetailDialogProps) {
  if (!event) {
    return null;
  }

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
              backgroundColor: getColorForCategory(event.extendedProps.category),
              color: "#fff",
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
      <DialogActions sx={{ p: "16px 24px" }}>
        <Button onClick={onClose}>Close</Button>
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
      </DialogActions>
    </Dialog>
  );
}

export default EventDetailDialog;
