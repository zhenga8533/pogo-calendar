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
import React, { useCallback, useEffect, useMemo, useState } from "react";
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

const CategoryExportPanel = React.memo(
  /**
   * Renders the panel for selecting event categories to export.
   *
   * @param param0 Props for the CategoryExportPanel component.
   * @returns A panel for selecting event categories to export.
   */
  function CategoryExportPanel({
    allCategories,
    selectedCategories,
    onSelectionChange,
  }: {
    allCategories: string[];
    selectedCategories: string[];
    onSelectionChange: (newSelection: string[]) => void;
  }) {
    // Handler to toggle category selection.
    const handleToggleCategory = useCallback(
      (category: string) => {
        const newSelection = selectedCategories.includes(category)
          ? selectedCategories.filter((c) => c !== category)
          : [...selectedCategories, category];
        onSelectionChange(newSelection);
      },
      [selectedCategories, onSelectionChange]
    );

    // Render the category selection panel.
    return (
      <Box sx={{ pt: 2 }}>
        <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1 }}>
          <Button onClick={() => onSelectionChange(allCategories)}>Select All</Button>
          <Button onClick={() => onSelectionChange([])}>Clear All</Button>
        </Stack>
        <Divider />
        <FormGroup sx={{ mt: 2, maxHeight: "40vh", overflowY: "auto" }}>
          {allCategories.map((category) => (
            <FormControlLabel
              key={category}
              control={
                <Checkbox
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleToggleCategory(category)}
                />
              }
              label={<ColorKeyLabel category={category} />}
            />
          ))}
        </FormGroup>
      </Box>
    );
  }
);

const SpecificEventExportPanel = React.memo(
  /**
   * Renders the panel for selecting specific events to export.
   *
   * @param param0 Props for the SpecificEventExportPanel component.
   * @returns A panel for selecting specific events to export.
   */
  function SpecificEventExportPanel({
    eventsToList,
    filteredEvents,
    savedEventIds,
    selectedEventIds,
    onSelectionChange,
  }: {
    eventsToList: CalendarEvent[];
    filteredEvents: CalendarEvent[];
    savedEventIds: string[];
    selectedEventIds: string[];
    onSelectionChange: (newSelection: string[]) => void;
  }) {
    // Handler to toggle individual event selection.
    const handleToggleEvent = useCallback(
      (eventId: string) => {
        const newSelection = selectedEventIds.includes(eventId)
          ? selectedEventIds.filter((id) => id !== eventId)
          : [...selectedEventIds, eventId];
        onSelectionChange(newSelection);
      },
      [selectedEventIds, onSelectionChange]
    );

    // Handler to select all saved events currently in the filtered list.
    const handleSelectSaved = useCallback(() => {
      const savedIdsInFilter = filteredEvents
        .filter((e) => savedEventIds.includes(e.extendedProps.article_url))
        .map((e) => e.extendedProps.article_url);
      onSelectionChange(Array.from(new Set([...selectedEventIds, ...savedIdsInFilter])));
    }, [filteredEvents, savedEventIds, selectedEventIds, onSelectionChange]);

    // Render the specific event selection panel.
    return (
      <Stack spacing={2} sx={{ mt: 2 }}>
        {/* Action buttons for bulk selection */}
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button onClick={handleSelectSaved}>Select Saved</Button>
          <Button onClick={() => onSelectionChange(eventsToList.map((e) => e.extendedProps.article_url))}>
            Select All Shown
          </Button>
          <Button onClick={() => onSelectionChange([])}>Clear All</Button>
        </Stack>

        {/* Divider */}
        <Divider />

        {/* Scrollable list of events with checkboxes */}
        <Box sx={{ maxHeight: "40vh", overflowY: "auto", p: 1 }}>
          <FormGroup>
            {eventsToList.length > 0 ? (
              eventsToList.map((event) => (
                <FormControlLabel
                  key={event.extendedProps.article_url}
                  control={
                    <Checkbox
                      checked={selectedEventIds.includes(event.extendedProps.article_url)}
                      onChange={() => handleToggleEvent(event.extendedProps.article_url)}
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
                {/* Message when no events are available to display */}
                No events to display.
              </Typography>
            )}
          </FormGroup>
        </Box>
      </Stack>
    );
  }
);

/**
 * Renders a dialog for exporting events by category or specific selection.
 *
 * @param param0 Props for the ExportEventDialog component.
 * @returns A dialog for exporting events by category or specific selection.
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

  useEffect(() => {
    if (open) {
      setTab(0);
      setSelectedCategories([]);
      setSelectedEventIds([]);
      setSearchTerm("");
    }
  }, [open]);

  const allCategories = useMemo(
    () => Array.from(new Set(allEvents.map((e) => e.extendedProps.category))).sort(),
    [allEvents]
  );

  const eventsToList = useMemo(
    () => filteredEvents.filter((event) => event.title.toLowerCase().includes(searchTerm.toLowerCase())),
    [filteredEvents, searchTerm]
  );

  // Handler for tab changes.
  const handleTabChange = useCallback((_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  }, []);

  // Handler for export button click.
  const handleExportClick = useCallback(() => {
    let eventsToExport: CalendarEvent[];
    if (tab === 0) {
      eventsToExport = allEvents.filter((event) => selectedCategories.includes(event.extendedProps.category));
    } else {
      eventsToExport = allEvents.filter((event) => selectedEventIds.includes(event.extendedProps.article_url));
    }
    onExport(eventsToExport);
    onClose();
  }, [tab, allEvents, selectedCategories, selectedEventIds, onExport, onClose]);

  const exportCount = tab === 0 ? selectedCategories.length : selectedEventIds.length;
  const isExportDisabled = exportCount === 0;

  // Render the export event dialog.
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Select Events to Export</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column" }}>
        {/* Tabs for selecting export mode */}
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tab} onChange={handleTabChange} aria-label="Export mode tabs">
            <Tab label="By Category" id="tab-0" aria-controls="tabpanel-0" />
            <Tab label="By Specific Event" id="tab-1" aria-controls="tabpanel-1" />
          </Tabs>
        </Box>

        {/* Category Export Panel */}
        {tab === 0 && (
          <Box id="tabpanel-0" role="tabpanel" aria-labelledby="tab-0">
            <CategoryExportPanel
              allCategories={allCategories}
              selectedCategories={selectedCategories}
              onSelectionChange={setSelectedCategories}
            />
          </Box>
        )}

        {/* Specific Event Export Panel */}
        {tab === 1 && (
          <Box id="tabpanel-1" role="tabpanel" aria-labelledby="tab-1">
            <TextField
              fullWidth
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              label="Search within filtered events..."
              sx={{ mt: 2 }}
            />
            <SpecificEventExportPanel
              eventsToList={eventsToList}
              filteredEvents={filteredEvents}
              savedEventIds={savedEventIds}
              selectedEventIds={selectedEventIds}
              onSelectionChange={setSelectedEventIds}
            />
          </Box>
        )}
      </DialogContent>

      {/* Dialog action buttons */}
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleExportClick} variant="contained" disabled={isExportDisabled}>
          Export ({exportCount})
        </Button>
      </DialogActions>
    </Dialog>
  );
}
