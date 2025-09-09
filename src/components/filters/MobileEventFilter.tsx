import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ReplayIcon from "@mui/icons-material/Replay";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import React from "react";
import { ColorKeyLabel } from "./ColorKeyLabel";
import { dayOptions, type EventFilterProps, type Filters, formatTime, marks } from "./EventFilter";

interface MobileEventFilterProps extends Omit<EventFilterProps, "isMobile"> {
  handleFilterChange: (field: keyof Filters, value: any) => void;
  handleCategoryChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenExportDialog: () => void;
}

/**
 * MobileEventFilter component to render the mobile version of the event filter.
 *
 * @param {MobileEventFilterProps} props Props containing filters, change handlers, categories, and event handlers.
 * @returns {React.ReactElement} The rendered MobileEventFilter component.
 */
export function MobileEventFilter({
  filters,
  onNewEventClick,
  onResetFilters,
  onOpenExportDialog,
  allCategories,
  handleFilterChange,
  handleCategoryChange,
}: MobileEventFilterProps) {
  return (
    <Stack spacing={3}>
      <TextField
        fullWidth
        label="Search by Event Title"
        variant="outlined"
        value={filters.searchTerm}
        onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
      />
      <DatePicker
        label="Start Date"
        value={filters.startDate}
        onChange={(date) => handleFilterChange("startDate", date)}
      />
      <DatePicker label="End Date" value={filters.endDate} onChange={(date) => handleFilterChange("endDate", date)} />
      <FormControl fullWidth>
        <InputLabel>Week Starts On</InputLabel>
        <Select
          value={filters.firstDay}
          label="Week Starts On"
          onChange={(e) => handleFilterChange("firstDay", e.target.value)}
        >
          {dayOptions.map((day) => (
            <MenuItem key={day.value} value={day.value}>
              {day.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box sx={{ px: 1 }}>
        <Typography gutterBottom variant="body2" color="text.secondary">
          Time of Day
        </Typography>
        <Slider
          value={filters.timeRange}
          onChange={(_, value) => handleFilterChange("timeRange", value as number[])}
          valueLabelFormat={formatTime}
          valueLabelDisplay="auto"
          marks={marks}
          min={0}
          max={24}
          step={1}
        />
      </Box>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Categories ({filters.selectedCategories.length})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            <FormControlLabel
              key="saved-events"
              control={
                <Checkbox
                  checked={filters.selectedCategories.includes("Saved")}
                  onChange={handleCategoryChange}
                  name="Saved"
                  icon={<StarBorderIcon />}
                  checkedIcon={<StarIcon />}
                />
              }
              label="Saved Events"
            />
            <Divider sx={{ my: 1 }} />
            {allCategories.map((category) => (
              <FormControlLabel
                key={category}
                control={
                  <Checkbox
                    checked={filters.selectedCategories.includes(category)}
                    onChange={handleCategoryChange}
                    name={category}
                  />
                }
                label={<ColorKeyLabel category={category} />}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>
      <Button variant="outlined" onClick={onOpenExportDialog} startIcon={<FileDownloadIcon />}>
        Export
      </Button>
      <Button variant="contained" onClick={onNewEventClick} startIcon={<AddCircleOutlineIcon />}>
        New Event
      </Button>
      <Button variant="outlined" onClick={onResetFilters} startIcon={<ReplayIcon />}>
        Reset All Filters
      </Button>
    </Stack>
  );
}
