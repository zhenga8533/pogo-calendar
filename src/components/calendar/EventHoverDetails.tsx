import { Box, Chip, Divider, Popover, Typography, useTheme } from "@mui/material"; // Ensure Chip is imported
import { format, intervalToDuration, isFuture, isPast, isSameDay, isWithinInterval } from "date-fns";
import type { CalendarEvent } from "../../types/events";
import { getColorForCategory } from "../../utils/colorUtils";

interface EventHoverDetailsProps {
  open: boolean;
  id: string | undefined;
  mousePosition: { top: number; left: number } | null;
  event: CalendarEvent | null;
  onClose: () => void;
}

/**
 * EventHoverDetails component to display event details on hover.
 *
 * @param param0 Props containing hover state and event data.
 * @returns The rendered EventHoverDetails component.
 */
function EventHoverDetails({ open, id, mousePosition, event, onClose }: EventHoverDetailsProps) {
  const theme = useTheme();

  if (!event) {
    return null;
  }

  const categoryColor = getColorForCategory(event.extendedProps.category, theme.palette.mode);
  const startDate = event.start ? new Date(event.start) : null;
  const endDate = event.end ? new Date(event.end) : null;
  const now = new Date();

  let eventStatus: "Upcoming" | "Active" | "Finished" = "Upcoming";
  if (startDate && endDate) {
    if (isWithinInterval(now, { start: startDate, end: endDate })) {
      eventStatus = "Active";
    } else if (isPast(endDate)) {
      eventStatus = "Finished";
    } else if (isFuture(startDate)) {
      eventStatus = "Upcoming";
    }
  } else if (startDate && isPast(startDate)) {
    eventStatus = "Finished";
  }

  let timeText = "";
  if (eventStatus === "Upcoming" && startDate) {
    const duration = intervalToDuration({ start: now, end: startDate });
    const parts = [];
    if (duration.years && duration.years > 0) parts.push(`${duration.years}y`);
    if (duration.months && duration.months > 0) parts.push(`${duration.months}m`);
    if (duration.days && duration.days > 0) parts.push(`${duration.days}d`);
    if (duration.hours && duration.hours > 0) parts.push(`${duration.hours}h`);
    if (duration.minutes && duration.minutes > 0) parts.push(`${duration.minutes}min`);
    timeText = parts.length > 0 ? `Starts in ${parts.join(" ")}` : "Starts soon";
  } else if (eventStatus === "Finished" && endDate) {
    const duration = intervalToDuration({ start: endDate, end: now });
    const parts = [];
    if (duration.years && duration.years > 0) parts.push(`${duration.years}y`);
    if (duration.months && duration.months > 0) parts.push(`${duration.months}m`);
    if (duration.days && duration.days > 0) parts.push(`${duration.days}d`);
    if (duration.hours && duration.hours > 0) parts.push(`${duration.hours}h`);
    if (duration.minutes && duration.minutes > 0) parts.push(`${duration.minutes}min`);
    timeText = parts.length > 0 ? `Ended ${parts.join(" ")} ago` : "Ended recently";
  } else if (eventStatus === "Active") {
    timeText = "Currently active";
  }

  const formatDateLine = (date: Date | null, showTime: boolean = true) => {
    if (!date) return null;
    return showTime ? format(date, "MMM d, yyyy h:mm a") : format(date, "MMM d, yyyy");
  };

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
      <Box
        sx={{
          px: 2,
          pt: 2,
          pb: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: "bold",
            color: theme.palette.text.primary,
            lineHeight: 1.3,
          }}
        >
          {event.title}
        </Typography>
        <Divider sx={{ my: 0.5 }} />
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

        {/* Status */}
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

        {/* Dates */}
        {startDate && (
          <Box sx={{ lineHeight: 1.4 }}>
            {isSameDay(startDate, endDate || startDate) ? (
              <Typography variant="body2" color="text.secondary">
                <Box component="span" sx={{ fontWeight: "bold" }}>
                  Date:
                </Box>{" "}
                {formatDateLine(startDate)}
              </Typography>
            ) : (
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
