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
  IconButton,
  Link,
  Typography,
} from "@mui/material";
import type { CalendarEvent } from "../../types/events";

interface EventDetailDialogProps {
  event: CalendarEvent | null;
  onClose: () => void;
  savedEventIds: string[];
  onToggleSaveEvent: (eventId: string) => void;
}

function EventDetailDialog({ event, onClose, savedEventIds, onToggleSaveEvent }: EventDetailDialogProps) {
  if (!event) {
    return null;
  }

  const isSaved = savedEventIds.includes(event.extendedProps.article_url);

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" component="div" sx={{ mr: 2 }}>
            {event.title}
          </Typography>
          <IconButton onClick={() => onToggleSaveEvent(event.extendedProps.article_url)} color="primary">
            {isSaved ? <StarIcon /> : <StarBorderIcon />}
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box
          component="img"
          src={event.extendedProps.banner_url}
          alt={`${event.title} banner`}
          sx={{
            width: "100%",
            borderRadius: 1,
            mb: 2,
          }}
        />
        <DialogContentText component="div">
          <strong>Category:</strong> {event.extendedProps.category}
          <br />
          <strong>Starts:</strong>{" "}
          {new Date(event.start!).toLocaleString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            timeZoneName: "short",
          })}
          <br />
          <strong>Ends:</strong>{" "}
          {new Date(event.end!).toLocaleString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            timeZoneName: "short",
          })}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button
          component={Link}
          href={event.extendedProps.article_url}
          target="_blank"
          rel="noopener noreferrer"
          variant="contained"
        >
          Learn More
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EventDetailDialog;
