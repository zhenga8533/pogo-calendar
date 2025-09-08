import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import React from "react";
import { getColorForCategory } from "../../utils/colorUtils";

interface Filters {
  searchTerm: string;
  selectedCategories: string[];
  startDate: Date | null;
  endDate: Date | null;
  timeRange: number[];
  showOnlySaved: boolean;
}

interface EventFilterProps {
  filters: Filters;
  onFilterChange: (newFilters: Omit<Filters, "showOnlySaved">) => void;
  onResetFilters: () => void;
  onNewEventClick: () => void;
  allCategories: string[];
}

const marks = [
  { value: 0, label: "12 AM" },
  { value: 6, label: "6 AM" },
  { value: 12, label: "12 PM" },
  { value: 18, label: "6 PM" },
  { value: 24, label: "12 AM" },
];

/**
 * Format hour value to 12-hour time with AM/PM
 *
 * @param value The hour value (0-24)
 * @returns Formatted time string (e.g., "12 AM", "1 PM")
 */
function formatTime(value: number) {
  if (value === 24) return "12 AM";
  const ampm = value < 12 ? "AM" : "PM";
  const hour = value % 12 === 0 ? 12 : value % 12;
  return `${hour} ${ampm}`;
}

/**
 * ColorKeyLabel component to display a colored circle and category name.
 *
 * @param param0 Props containing category name.
 * @returns The rendered ColorKeyLabel component.
 */
function ColorKeyLabel({ category }: { category: string }) {
  const theme = useTheme();
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box
        component="span"
        sx={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          mr: 1.5,
          backgroundColor: getColorForCategory(category, theme.palette.mode),
          border: `1px solid ${theme.palette.divider}`,
        }}
      />
      {category}
    </Box>
  );
}

/**
 * EventFilter component to filter events based on various criteria.
 *
 * @param param0 Props containing current filters, change handlers, and all categories.
 * @returns The rendered EventFilter component.
 */
function EventFilter({ filters, onFilterChange, onResetFilters, onNewEventClick, allCategories }: EventFilterProps) {
  // Handle changes to individual filter fields
  const handleFilterChange = (field: keyof Filters, value: any) => {
    onFilterChange({ ...filters, [field]: value });
  };

  // Handle changes to category checkboxes
  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const category = event.target.name;
    const isChecked = event.target.checked;
    const newSelectedCategories = isChecked
      ? [...filters.selectedCategories, category]
      : filters.selectedCategories.filter((c) => c !== category);
    handleFilterChange("selectedCategories", newSelectedCategories);
  };

  // Render the filter UI
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ display: "flex", flexWrap: "wrap", mx: -1.5, mb: 3 }}>
        <Box sx={{ p: 1.5, width: { xs: "100%", md: "50%" } }}>
          <TextField
            fullWidth
            label="Search by Event Title"
            variant="outlined"
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
          />
        </Box>
        <Box sx={{ p: 1.5, width: { xs: "100%", md: "50%" } }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <DatePicker
              label="Start Date"
              value={filters.startDate}
              onChange={(date) => handleFilterChange("startDate", date)}
            />
            <DatePicker
              label="End Date"
              value={filters.endDate}
              onChange={(date) => handleFilterChange("endDate", date)}
            />
          </Box>
        </Box>
        <Box sx={{ p: 1.5, width: { xs: "100%", md: "50%" } }}>
          <Button
            variant="contained"
            onClick={onNewEventClick}
            startIcon={<AddCircleOutlineIcon />}
            fullWidth
            sx={{ height: "56px" }}
          >
            New Event
          </Button>
        </Box>
        <Box sx={{ p: 1.5, width: { xs: "100%", md: "50%" } }}>
          <Button
            variant="outlined"
            onClick={onResetFilters}
            startIcon={<ReplayIcon />}
            fullWidth
            sx={{ height: "56px" }}
          >
            Reset
          </Button>
        </Box>
        <Box sx={{ p: 1.5, width: "100%" }}>
          <Box sx={{ px: 1 }}>
            <Typography gutterBottom>Time of Day</Typography>
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
        </Box>
        <Box sx={{ p: 1.5, width: "100%" }}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Filter by Category</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormGroup sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, auto))" }}>
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
                <Divider sx={{ gridColumn: "1 / -1", my: 1 }} />
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
        </Box>
      </Box>
    </LocalizationProvider>
  );
}

export default EventFilter;
