import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  FormGroup,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import type { CalendarEvent } from "../../types/events";
import { ColorKeyLabel } from "../filters/ColorKeyLabel";

interface ExportEventDialogProps {
  open: boolean;
  onClose: () => void;
  onExport: (selectedEvents: CalendarEvent[]) => void;
  allEvents: CalendarEvent[];
  filteredEvents: CalendarEvent[];
  savedEventIds: string[];
}

/**
 * ExportEventDialog component to select and export events by category or specific events.
 *
 * @param param0 Props including open state, close handler, export handler, all events, filtered events, and saved event IDs.
 * @returns The rendered ExportEventDialog component.
 */
export function ExportEventDialog({
  open,
  onClose,
  onExport,
  allEvents,
  filteredEvents,
  savedEventIds,
}: ExportEventDialogProps) {
  const [tab, setTab] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Reset selections when dialog is opened
  useEffect(() => {
    if (open) {
      setSelectedCategories([]);
      setSelectedEventIds([]);
      setSearchTerm("");
      setTab(0);
    }
  }, [open]);

  // Get all unique categories from all events
  const allCategories = useMemo(
    () => Array.from(new Set(allEvents.map((e) => e.extendedProps.category))).sort(),
    [allEvents]
  );

  // Filter events based on search term
  const eventsToList = useMemo(() => {
    return filteredEvents.filter((event) => event.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [filteredEvents, searchTerm]);

  // Handle export button click
  const handleExportClick = () => {
    let eventsToExport: CalendarEvent[] = [];
    if (tab === 0) {
      eventsToExport = allEvents.filter((event) => selectedCategories.includes(event.extendedProps.category));
    } else {
      eventsToExport = allEvents.filter((event) => selectedEventIds.includes(event.extendedProps.article_url));
    }
    onExport(eventsToExport);
    onClose();
  };

  // Render the dialog
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Select Events to Export</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)} aria-label="Export mode">
            <Tab label="By Category" />
            <Tab label="By Specific Event" />
          </Tabs>
        </Box>

        {tab === 0 && (
          <Box sx={{ pt: 2 }}>
            <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1 }}>
              <Button onClick={() => setSelectedCategories(allCategories)}>Select All</Button>
              <Button onClick={() => setSelectedCategories([])}>Clear All</Button>
            </Stack>
            <Divider />
            <FormGroup sx={{ mt: 2, maxHeight: "40vh", overflowY: "auto" }}>
              {allCategories.map((category) => (
                <FormControlLabel
                  key={category}
                  control={
                    <Checkbox
                      checked={selectedCategories.includes(category)}
                      onChange={() =>
                        setSelectedCategories((prev) =>
                          prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
                        )
                      }
                    />
                  }
                  label={<ColorKeyLabel category={category} />}
                />
              ))}
            </FormGroup>
          </Box>
        )}

        {tab === 1 && (
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              label="Search within filtered events..."
            />
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button
                onClick={() =>
                  setSelectedEventIds((prev) =>
                    Array.from(
                      new Set([
                        ...prev,
                        ...filteredEvents
                          .filter((e) => savedEventIds.includes(e.extendedProps.article_url))
                          .map((e) => e.extendedProps.article_url),
                      ])
                    )
                  )
                }
              >
                Select Saved
              </Button>
              <Button onClick={() => setSelectedEventIds(eventsToList.map((e) => e.extendedProps.article_url))}>
                Select All Shown
              </Button>
              <Button onClick={() => setSelectedEventIds([])}>Clear All</Button>
            </Stack>
            <Divider />
            <Box sx={{ maxHeight: "40vh", overflowY: "auto", p: 1 }}>
              <FormGroup>
                {eventsToList.length > 0 ? (
                  eventsToList.map((event) => (
                    <FormControlLabel
                      key={event.extendedProps.article_url}
                      control={
                        <Checkbox
                          checked={selectedEventIds.includes(event.extendedProps.article_url)}
                          onChange={() =>
                            setSelectedEventIds((prev) =>
                              prev.includes(event.extendedProps.article_url)
                                ? prev.filter((id) => id !== event.extendedProps.article_url)
                                : [...prev, event.extendedProps.article_url]
                            )
                          }
                        />
                      }
                      label={
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <ColorKeyLabel category={event.extendedProps.category} showText={false} />
                          <Typography variant="body2">{event.title}</Typography>
                        </Stack>
                      }
                    />
                  ))
                ) : (
                  <Typography color="text.secondary" sx={{ p: 2, textAlign: "center" }}>
                    No events to display.
                  </Typography>
                )}
              </FormGroup>
            </Box>
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleExportClick}
          variant="contained"
          disabled={(tab === 0 && selectedCategories.length === 0) || (tab === 1 && selectedEventIds.length === 0)}
        >
          Export ({tab === 0 ? selectedCategories.length : selectedEventIds.length})
        </Button>
      </DialogActions>
    </Dialog>
  );
}
