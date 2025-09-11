import { Box, Chip, Divider, Popover, Typography, useTheme } from "@mui/material";
import { intervalToDuration, isFuture, isPast, isSameDay, isWithinInterval } from "date-fns";
import { useMemo } from "react";
import type { CalendarEvent } from "../../types/events";
import { getColorForCategory } from "../../utils/colorUtils";
import { formatDateLine, formatDurationFromInterval } from "../../utils/dateUtils";

interface EventHoverDetailsProps {
  open: boolean;
  id: string | undefined;
  mousePosition: { top: number; left: number } | null;
  event: CalendarEvent | null;
  onClose: () => void;
}

/**
 * Displays a popover with detailed information about a calendar event when hovered over.
 *
 * @param param0 Props for the EventHoverDetails component.
 * @returns A popover displaying detailed information about a calendar event.
 */
function EventHoverDetails({ open, id, mousePosition, event, onClose }: EventHoverDetailsProps) {
  const theme = useTheme();

  const { startDate, endDate } = useMemo(() => {
    const start = event?.start ? new Date(event.start) : null;
    const end = event?.end ? new Date(event.end) : null;
    return { startDate: start, endDate: end };
  }, [event?.start, event?.end]);

  const categoryColor = useMemo(() => {
    if (!event?.extendedProps.category) return "default";
    return getColorForCategory(event.extendedProps.category, theme.palette.mode);
  }, [event?.extendedProps.category, theme.palette.mode]);

  const eventStatus = useMemo(() => {
    const now = new Date();
    if (startDate && endDate) {
      if (isWithinInterval(now, { start: startDate, end: endDate })) return "Active";
      if (isPast(endDate)) return "Finished";
      if (isFuture(startDate)) return "Upcoming";
    } else if (startDate && isPast(startDate)) {
      return "Finished";
    }
    return "Upcoming";
  }, [startDate, endDate]);

  const timeText = useMemo(() => {
    const now = new Date();
    if (eventStatus === "Upcoming" && startDate) {
      const duration = intervalToDuration({ start: now, end: startDate });
      const formatted = formatDurationFromInterval(duration);
      return formatted ? `Starts in ${formatted}` : "Starts soon";
    }
    if (eventStatus === "Finished" && endDate) {
      const duration = intervalToDuration({ start: endDate, end: now });
      const formatted = formatDurationFromInterval(duration);
      return formatted ? `Ended ${formatted} ago` : "Ended recently";
    }
    if (eventStatus === "Active") {
      return "Currently active";
    }
    return "";
  }, [eventStatus, startDate, endDate]);

  // If there is no event data, render nothing.
  if (!event) {
    return null;
  }

  // Render the popover with event details.
  return (
    <Popover
      id={id}
      open={open}
      anchorReference="anchorPosition"
      anchorPosition={mousePosition ? { top: mousePosition.top - 10, left: mousePosition.left } : undefined}
      onClose={onClose}
      sx={{
        pointerEvents: "none",
      }}
      anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      disableRestoreFocus
      disableScrollLock
      container={document.body}
      slotProps={{
        paper: {
          sx: {
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[8],
            borderRadius: 2,
            maxWidth: "300px",
            p: 0,
            overflow: "hidden",
            border: `1px solid ${theme.palette.divider}`,
          },
        },
      }}
    >
      <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
        {/* Event Title */}
        <Typography variant="h6" component="h3" sx={{ fontWeight: "bold", lineHeight: 1.3 }}>
          {event.title}
        </Typography>

        {/* Divider */}
        <Divider sx={{ my: 0.5 }} />

        {/* Category Chip */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: "bold" }}>
            Category:
          </Typography>
          <Chip
            label={event.extendedProps.category}
            size="small"
            sx={{
              backgroundColor: categoryColor,
              color: theme.palette.getContrastText(categoryColor),
              fontWeight: "bold",
            }}
          />
        </Box>

        {/* Status and Relative Time */}
        <Typography variant="body2" color="text.secondary">
          <Box component="span" sx={{ fontWeight: "bold" }}>
            Status:
          </Box>{" "}
          {eventStatus}{" "}
          {timeText && (
            <Box component="span" sx={{ fontStyle: "italic" }}>
              ({timeText})
            </Box>
          )}
        </Typography>

        {/* Date and Time Information */}
        {startDate && (
          <Box sx={{ lineHeight: 1.4 }}>
            {isSameDay(startDate, endDate || startDate) ? (
              // Case for single-day events
              <Typography variant="body2" color="text.secondary">
                <Box component="span" sx={{ fontWeight: "bold" }}>
                  Date:
                </Box>{" "}
                {formatDateLine(startDate)}
              </Typography>
            ) : (
              // Case for multi-day events
              <>
                <Typography variant="body2" color="text.secondary">
                  <Box component="span" sx={{ fontWeight: "bold" }}>
                    From:
                  </Box>{" "}
                  {formatDateLine(startDate)}
                </Typography>
                {endDate && (
                  <Typography variant="body2" color="text.secondary">
                    <Box component="span" sx={{ fontWeight: "bold" }}>
                      To:
                    </Box>{" "}
                    {formatDateLine(
                      endDate,
                      endDate.getHours() !== 0 || endDate.getMinutes() !== 0 || endDate.getSeconds() !== 0
                    )}
                  </Typography>
                )}
              </>
            )}
          </Box>
        )}
      </Box>
    </Popover>
  );
}

export default EventHoverDetails;
