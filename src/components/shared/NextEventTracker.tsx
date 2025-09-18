import UpdateIcon from "@mui/icons-material/Update";
import { Box, Paper, Stack, Tooltip, Typography, keyframes } from "@mui/material";
import { useEventStatus } from "../../hooks/useEventStatus";
import type { CalendarEvent } from "../../types/events";
import { ColorKeyLabel } from "../filters/ColorKeyLabel";

interface NextEventTrackerProps {
  nextEvent: CalendarEvent | null;
  onEventClick: (event: CalendarEvent) => void;
}

const pulseAnimation = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(179, 157, 219, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(179, 157, 219, 0); }
  100% { box-shadow: 0 0 0 0 rgba(179, 157, 219, 0); }
`;

function NextEventTracker({ nextEvent, onEventClick }: NextEventTrackerProps) {
  const { displayTime } = useEventStatus(nextEvent?.start ?? null, nextEvent?.end ?? null);

  if (!nextEvent) {
    return null;
  }

  return (
    <Tooltip title={`Click to see details for ${nextEvent.title}`}>
      <Paper
        onClick={() => onEventClick(nextEvent)}
        elevation={2}
        sx={{
          p: 1.5,
          pl: 2,
          display: "flex",
          alignItems: "center",
          borderRadius: 4,
          cursor: "pointer",
          animation: `${pulseAnimation} 2.5s infinite`,
          border: 1,
          borderColor: "primary.light",
          maxHeight: 44, // Constrain the height
          "&:hover": {
            backgroundColor: "action.hover",
          },
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <UpdateIcon color="primary" />
          <Stack alignItems="flex-start">
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }}>
              NEXT EVENT
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              <ColorKeyLabel category={nextEvent.extendedProps.category} showText={false} />
              <Typography variant="body2" sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                {nextEvent.title}
              </Typography>
            </Stack>
          </Stack>
          <Box
            sx={{
              width: "1px",
              height: "24px",
              backgroundColor: "divider",
              mx: 1,
            }}
          />
          <Typography variant="body2" color="primary" sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
            {displayTime}
          </Typography>
        </Stack>
      </Paper>
    </Tooltip>
  );
}

export default NextEventTracker;
