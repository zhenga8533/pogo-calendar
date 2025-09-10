import { Popover, useTheme } from "@mui/material";
import type { CalendarEvent } from "../../types/events";
import { EventPopover } from "./EventPopover";

interface EventHoverPopoverProps {
  open: boolean;
  id: string | undefined;
  mousePosition: { top: number; left: number } | null;
  popoverEvent: CalendarEvent | null;
  onClose: () => void;
}

/**
 * EventHoverPopover component to display event details on hover.
 *
 * @param {EventHoverPopoverProps} param0 Props containing hover state and event data.
 * @returns {React.ReactElement} The rendered EventHoverPopover component.
 */
function EventHoverPopover({ open, id, mousePosition, popoverEvent, onClose }: EventHoverPopoverProps) {
  const theme = useTheme();

  // Render the popover with event details
  return (
    <Popover
      id={id}
      open={open}
      anchorReference="anchorPosition"
      anchorPosition={mousePosition ? { top: mousePosition.top - 5, left: mousePosition.left } : undefined}
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
            boxShadow: theme.shadows[3],
            borderRadius: "8px",
          },
        },
      }}
    >
      {popoverEvent && <EventPopover event={popoverEvent} />}
    </Popover>
  );
}

export default EventHoverPopover;
