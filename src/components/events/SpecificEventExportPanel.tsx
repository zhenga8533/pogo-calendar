import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Stack,
  Typography,
} from '@mui/material';
import React, { useCallback } from 'react';
import type { CalendarEvent } from '../../types/events';
import { ColorKeyLabel } from '../filters/ColorKeyLabel';

interface SpecificEventExportPanelProps {
  eventsToList: CalendarEvent[];
  filteredEvents: CalendarEvent[];
  savedEventIds: string[];
  selectedEventIds: string[];
  onSelectionChange: (newSelection: string[]) => void;
}

export const SpecificEventExportPanel = React.memo(
  function SpecificEventExportPanel({
    eventsToList,
    filteredEvents,
    savedEventIds,
    selectedEventIds,
    onSelectionChange,
  }: SpecificEventExportPanelProps) {
    const handleToggleEvent = useCallback(
      (eventId: string) => {
        const newSelection = selectedEventIds.includes(eventId)
          ? selectedEventIds.filter((id) => id !== eventId)
          : [...selectedEventIds, eventId];
        onSelectionChange(newSelection);
      },
      [selectedEventIds, onSelectionChange]
    );

    const handleSelectSaved = useCallback(() => {
      const savedIdsInFilter = filteredEvents
        .filter((e) => savedEventIds.includes(e.extendedProps.article_url))
        .map((e) => e.extendedProps.article_url);
      onSelectionChange(
        Array.from(new Set([...selectedEventIds, ...savedIdsInFilter]))
      );
    }, [filteredEvents, savedEventIds, selectedEventIds, onSelectionChange]);

    return (
      <Stack spacing={2} sx={{ mt: 2 }}>
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button onClick={handleSelectSaved}>Select Saved</Button>
          <Button
            onClick={() =>
              onSelectionChange(
                eventsToList.map((e) => e.extendedProps.article_url)
              )
            }
          >
            Select All Shown
          </Button>
          <Button onClick={() => onSelectionChange([])}>Clear All</Button>
        </Stack>
        <Divider />
        <Box sx={{ maxHeight: '40vh', overflowY: 'auto', p: 1 }}>
          <FormGroup>
            {eventsToList.length > 0 ? (
              eventsToList.map((event) => (
                <FormControlLabel
                  key={event.extendedProps.article_url}
                  control={
                    <Checkbox
                      checked={selectedEventIds.includes(
                        event.extendedProps.article_url
                      )}
                      onChange={() =>
                        handleToggleEvent(event.extendedProps.article_url)
                      }
                    />
                  }
                  label={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <ColorKeyLabel
                        category={event.extendedProps.category}
                        showText={false}
                      />
                      <Typography variant="body2">{event.title}</Typography>
                    </Stack>
                  }
                />
              ))
            ) : (
              <Typography
                color="text.secondary"
                sx={{ p: 2, textAlign: 'center' }}
              >
                No events to display.
              </Typography>
            )}
          </FormGroup>
        </Box>
      </Stack>
    );
  }
);
