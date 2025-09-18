import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Tab, Tabs, TextField } from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import type { CalendarEvent } from "../../types/events";
import { CategoryExportPanel } from "./CategoryExportPanel";
import { SpecificEventExportPanel } from "./SpecificEventExportPanel";

interface ExportEventDialogProps {
  open: boolean;
  onClose: () => void;
  onExport: (selectedEvents: CalendarEvent[]) => void;
  allEvents: CalendarEvent[];
  filteredEvents: CalendarEvent[];
  savedEventIds: string[];
}

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

  const handleTabChange = useCallback((_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  }, []);

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

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Select Events to Export</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tab} onChange={handleTabChange} aria-label="Export mode tabs">
            <Tab label="By Category" id="tab-0" aria-controls="tabpanel-0" />
            <Tab label="By Specific Event" id="tab-1" aria-controls="tabpanel-1" />
          </Tabs>
        </Box>

        {tab === 0 && (
          <Box id="tabpanel-0" role="tabpanel" aria-labelledby="tab-0">
            <CategoryExportPanel
              allCategories={allCategories}
              selectedCategories={selectedCategories}
              onSelectionChange={setSelectedCategories}
            />
          </Box>
        )}

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

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleExportClick} variant="contained" disabled={isExportDisabled}>
          Export ({exportCount})
        </Button>
      </DialogActions>
    </Dialog>
  );
}
