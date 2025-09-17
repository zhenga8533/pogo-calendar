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
  FormControlLabel,
  FormGroup,
  Slider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import React from "react";
import { formatTime, marks, SAVED_EVENTS_CATEGORY } from "../../config/eventFilter";
import type { EventFilterProps, Filters } from "../../types/filters";
import { CategoryCheckbox } from "./CategoryCheckbox";

interface MobileEventFilterProps extends Omit<EventFilterProps, "isMobile"> {
  handleFilterChange: (field: keyof Filters, value: any) => void;
  handleCategoryChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenExportDialog: () => void;
}

const CategoryFilterAccordion = React.memo(
  /**
   * Renders the accordion for selecting event categories.
   *
   * @param param0 Props for the CategoryFilterAccordion component.
   * @returns An accordion for selecting event categories.
   */
  function CategoryFilterAccordion({
    selectedCategories,
    allCategories,
    onCategoryChange,
  }: {
    selectedCategories: string[];
    allCategories: string[];
    onCategoryChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  }) {
    return (
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Categories ({selectedCategories.length})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {/* Special "Saved Events" checkbox */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedCategories.includes(SAVED_EVENTS_CATEGORY)}
                  onChange={onCategoryChange}
                  name={SAVED_EVENTS_CATEGORY}
                  icon={<StarBorderIcon />}
                  checkedIcon={<StarIcon />}
                />
              }
              label="Saved Events"
            />

            {/* Divider */}
            <Divider sx={{ my: 1 }} />

            {/* Render all other categories using the reusable component */}
            {allCategories.map((category) => (
              <CategoryCheckbox
                key={category}
                category={category}
                isChecked={selectedCategories.includes(category)}
                onChange={onCategoryChange}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>
    );
  }
);

/**
 * Renders the mobile version of the event filter component.
 *
 * @param param0 Props for the MobileEventFilter component.
 * @returns The mobile version of the event filter component.
 */
function MobileEventFilterComponent({
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
      {/* Search Field */}
      <TextField
        fullWidth
        label="Search by Event Title"
        variant="outlined"
        value={filters.searchTerm}
        onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
      />

      {/* Date Pickers */}
      <DatePicker
        label="Start Date"
        value={filters.startDate}
        onChange={(date) => handleFilterChange("startDate", date)}
      />
      <DatePicker label="End Date" value={filters.endDate} onChange={(date) => handleFilterChange("endDate", date)} />

      {/* Time of Day Slider */}
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

      {/* Category Filter Accordion */}
      <CategoryFilterAccordion
        selectedCategories={filters.selectedCategories}
        allCategories={allCategories}
        onCategoryChange={handleCategoryChange}
      />

      {/* Action Buttons */}
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

export const MobileEventFilter = React.memo(MobileEventFilterComponent);
