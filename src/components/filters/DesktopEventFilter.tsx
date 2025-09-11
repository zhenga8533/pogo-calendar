import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FilterListIcon from "@mui/icons-material/FilterList";
import ReplayIcon from "@mui/icons-material/Replay";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import {
  Badge,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  Menu,
  MenuItem,
  Paper,
  Select,
  Slider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import React, { useMemo } from "react";
import { categoryGroups, dayOptions, formatTime, marks, SAVED_EVENTS_CATEGORY } from "../../config/eventFilter";
import type { EventFilterProps, Filters } from "../../types/filters";
import { CategoryCheckbox } from "./CategoryCheckbox";

interface DesktopEventFilterProps extends Omit<EventFilterProps, "isMobile"> {
  anchorEl: HTMLElement | null;
  handleMenuClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleMenuClose: () => void;
  handleFilterChange: (field: keyof Filters, value: any) => void;
  handleCategoryChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectAll: () => void;
  handleClearAll: () => void;
  onOpenExportDialog: () => void;
}

const CategoryFilterMenu = React.memo(
  /**
   * Renders the menu for selecting event categories.
   *
   * @param param0 Props for the CategoryFilterMenu component.
   * @returns A menu for selecting event categories.
   */
  function CategoryFilterMenu({
    anchorEl,
    onClose,
    filters,
    allCategories,
    otherCategories,
    onCategoryChange,
    onSelectAll,
    onClearAll,
  }: {
    anchorEl: HTMLElement | null;
    onClose: () => void;
    filters: Filters;
    allCategories: string[];
    otherCategories: string[];
    onCategoryChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onSelectAll: () => void;
    onClearAll: () => void;
  }) {
    // Render the category filter menu.
    return (
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onClose}>
        <Box sx={{ p: 2, width: { xs: "280px", md: "550px" } }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="h6" component="div">
              Categories
            </Typography>

            {/* Action Buttons */}
            <Stack direction="row" spacing={1}>
              <Button size="small" onClick={onSelectAll}>
                Select All
              </Button>
              <Button size="small" onClick={onClearAll}>
                Clear All
              </Button>
            </Stack>
          </Stack>
          <Divider sx={{ mb: 2 }} />
          <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 1, md: 4 }}>
            {/* Group 1: Special & Main Categories */}
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.selectedCategories.includes(SAVED_EVENTS_CATEGORY)}
                    onChange={onCategoryChange}
                    name={SAVED_EVENTS_CATEGORY}
                    icon={<StarBorderIcon />}
                    checkedIcon={<StarIcon />}
                  />
                }
                label="Saved Events"
              />
              <Divider sx={{ my: 1 }} />
              {Object.entries(categoryGroups).map(([groupName, categories]) => (
                <React.Fragment key={groupName}>
                  <Typography variant="overline" color="text.secondary">
                    {groupName}
                  </Typography>
                  {categories
                    .filter((c) => allCategories.includes(c))
                    .map((category) => (
                      <CategoryCheckbox
                        key={category}
                        category={category}
                        isChecked={filters.selectedCategories.includes(category)}
                        onChange={onCategoryChange}
                      />
                    ))}
                </React.Fragment>
              ))}
            </FormGroup>

            {/* Group 2: Other Categories */}
            {otherCategories.length > 0 && (
              <FormGroup>
                <Typography variant="overline" color="text.secondary">
                  Other
                </Typography>
                {otherCategories.map((category) => (
                  <CategoryCheckbox
                    key={category}
                    category={category}
                    isChecked={filters.selectedCategories.includes(category)}
                    onChange={onCategoryChange}
                  />
                ))}
              </FormGroup>
            )}
          </Stack>
        </Box>
      </Menu>
    );
  }
);

/**
 * Renders the desktop version of the event filter component.
 *
 * @param param0 Props for the DesktopEventFilter component.
 * @returns The desktop version of the event filter component.
 */
function DesktopEventFilterComponent({
  filters,
  onNewEventClick,
  onResetFilters,
  onOpenExportDialog,
  allCategories,
  anchorEl,
  handleMenuClick,
  handleMenuClose,
  handleFilterChange,
  handleCategoryChange,
  handleSelectAll,
  handleClearAll,
}: DesktopEventFilterProps) {
  const otherCategories = useMemo(
    () => allCategories.filter((cat) => !Object.values(categoryGroups).flat().includes(cat)),
    [allCategories]
  );

  // Render the desktop event filter component.
  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Stack spacing={2}>
        {/* Row 1: Search and Week Start */}
        <Stack direction="row" spacing={2}>
          <TextField
            fullWidth
            label="Search by Event Title"
            variant="outlined"
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
            sx={{ flexGrow: 3 }}
          />
          <FormControl sx={{ flexGrow: 1, minWidth: 180 }}>
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
        </Stack>

        {/* Row 2: Date Pickers */}
        <Stack direction="row" spacing={2}>
          <DatePicker
            label="Start Date"
            value={filters.startDate}
            onChange={(date) => handleFilterChange("startDate", date)}
            sx={{ width: "100%" }}
          />
          <DatePicker
            label="End Date"
            value={filters.endDate}
            onChange={(date) => handleFilterChange("endDate", date)}
            sx={{ width: "100%" }}
          />
        </Stack>

        {/* Row 3: Time Slider */}
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
        <Divider />

        {/* Row 4: Action Buttons */}
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Badge badgeContent={filters.selectedCategories.length} color="primary">
            <Button variant="outlined" startIcon={<FilterListIcon />} onClick={handleMenuClick}>
              Categories
            </Button>
          </Badge>
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" onClick={onOpenExportDialog} startIcon={<FileDownloadIcon />}>
              Export
            </Button>
            <Button variant="contained" onClick={onNewEventClick} startIcon={<AddCircleOutlineIcon />}>
              New Event
            </Button>
            <Button variant="outlined" onClick={onResetFilters} startIcon={<ReplayIcon />}>
              Reset
            </Button>
          </Stack>
        </Stack>
      </Stack>

      {/* Category Filter Menu */}
      <CategoryFilterMenu
        anchorEl={anchorEl}
        onClose={handleMenuClose}
        filters={filters}
        allCategories={allCategories}
        otherCategories={otherCategories}
        onCategoryChange={handleCategoryChange}
        onSelectAll={handleSelectAll}
        onClearAll={handleClearAll}
      />
    </Paper>
  );
}

/**
 * NOTE: For React.memo to be effective here, the handler functions passed as props
 * (e.g., `onNewEventClick`, `handleFilterChange`) should be memoized with `useCallback`
 * in the parent component where they are defined.
 */
export const DesktopEventFilter = React.memo(DesktopEventFilterComponent);
