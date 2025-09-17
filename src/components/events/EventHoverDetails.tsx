import { Box, Chip, Divider, Popover, Typography, useTheme } from "@mui/material";
import { useMemo } from "react";
import type { CalendarEvent } from "../../types/events";
import { getColorForCategory } from "../../utils/colorUtils";
import { formatDateLine } from "../../utils/dateUtils";

interface EventHoverDetailsProps {
  open: boolean;
  id: string | undefined;
  mousePosition: { top: number; left: number } | null;
  event: CalendarEvent | null;
  hour12: boolean;
  onClose: () => void;
}

function EventHoverDetails({ open, id, mousePosition, event, hour12, onClose }: EventHoverDetailsProps) {
  const theme = useTheme();

  const formattedStart = useMemo(
    () => (event?.start ? formatDateLine(event.start, hour12) : null),
    [event?.start, hour12]
  );
  const formattedEnd = useMemo(() => (event?.end ? formatDateLine(event.end, hour12) : null), [event?.end, hour12]);
  const categoryColor = useMemo(() => {
    if (!event?.extendedProps.category) return "default";
    return getColorForCategory(event.extendedProps.category, theme.palette.mode);
  }, [event?.extendedProps.category, theme.palette.mode]);

  if (!event) {
    return null;
  }

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
        <Typography variant="h6" component="h3" sx={{ fontWeight: "bold", lineHeight: 1.3 }}>
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

        {event.start && (
          <Typography variant="body2" color="text.secondary">
            <Box component="span" sx={{ fontWeight: "bold" }}>
              Start:
            </Box>{" "}
            {formattedStart}
          </Typography>
        )}
        {event.end && (
          <Typography variant="body2" color="text.secondary">
            <Box component="span" sx={{ fontWeight: "bold" }}>
              End:
            </Box>{" "}
            {formattedEnd}
          </Typography>
        )}
      </Box>
    </Popover>
  );
}

export default EventHoverDetails;
