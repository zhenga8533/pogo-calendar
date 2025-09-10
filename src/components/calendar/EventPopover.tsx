import { Box, Chip, Stack, Typography, useTheme } from "@mui/material";
import { useEventStatus } from "../../hooks/useEventStatus";
import type { CalendarEvent } from "../../types/events";
import { getColorForCategory } from "../../utils/colorUtils";

interface EventPopoverProps {
  event: CalendarEvent;
}

/**
 * EventPopover component to display event details in a popover.
 *
 * @param param0 Props containing event data.
 * @returns {React.ReactElement} The rendered EventPopover component.
 */
export function EventPopover({ event }: EventPopoverProps) {
  const theme = useTheme();
  const { status, displayTime } = useEventStatus(event.start ?? null, event.end ?? null);

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  const statusInfo = {
    active: { label: "Active Now", color: theme.palette.success.main, prefix: "Ends in:" },
    upcoming: { label: "Upcoming", color: theme.palette.warning.main, prefix: "Starts in:" },
    finished: { label: "Finished", color: theme.palette.action.disabled, prefix: "Finished:" },
  };

  // Render the popover with event details
  return (
    <Box sx={{ p: 2, minWidth: 250, maxWidth: 350 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 1, flexWrap: "wrap", gap: 1 }}
      >
        <Chip
          label={event.extendedProps.category}
          size="small"
          sx={{
            backgroundColor: getColorForCategory(event.extendedProps.category, theme.palette.mode),
            color: theme.palette.getContrastText(getColorForCategory(event.extendedProps.category, theme.palette.mode)),
            fontWeight: "bold",
          }}
        />

        <Box
          sx={{
            backgroundColor: statusInfo[status].color,
            color: theme.palette.getContrastText(statusInfo[status].color),
            borderRadius: "4px",
            px: 1,
            py: 0.2,
            fontSize: "0.75rem",
            fontWeight: "bold",
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          {statusInfo[status].label}
          {displayTime && (
            <Typography variant="caption" color="inherit" component="span" sx={{ ml: 0.5 }}>
              {statusInfo[status].prefix} {displayTime}
            </Typography>
          )}
        </Box>
      </Stack>

      <Typography variant="h6" sx={{ mb: 1 }}>
        {event.title}
      </Typography>

      {event.start && event.end && (
        <Typography variant="body2" color="text.secondary">
          {new Date(event.start).toLocaleTimeString("en-US", timeOptions)} -{" "}
          {new Date(event.end).toLocaleTimeString("en-US", timeOptions)}
        </Typography>
      )}
    </Box>
  );
}
