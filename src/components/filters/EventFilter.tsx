import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ReplayIcon from "@mui/icons-material/Replay";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
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

interface Filters {
  searchTerm: string;
  selectedCategories: string[];
  startDate: Date | null;
  endDate: Date | null;
  timeRange: number[];
}

interface EventFilterProps {
  filters: Filters;
  onFilterChange: (newFilters: Filters) => void;
  onResetFilters: () => void;
  allCategories: string[];
}

const marks = [
  { value: 0, label: "12 AM" },
  { value: 6, label: "6 AM" },
  { value: 12, label: "12 PM" },
  { value: 18, label: "6 PM" },
  { value: 24, label: "12 AM" },
];

function formatTime(value: number) {
  if (value === 24) return "12 AM";
  const ampm = value < 12 ? "AM" : "PM";
  const hour = value % 12 === 0 ? 12 : value % 12;
  return `${hour} ${ampm}`;
}

function EventFilter({ filters, onFilterChange, onResetFilters, allCategories }: EventFilterProps) {
  const theme = useTheme();

  const handleFilterChange = (field: keyof Filters, value: any) => {
    onFilterChange({ ...filters, [field]: value });
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const category = event.target.name;
    const isChecked = event.target.checked;
    const newSelectedCategories = isChecked
      ? [...filters.selectedCategories, category]
      : filters.selectedCategories.filter((c) => c !== category);
    handleFilterChange("selectedCategories", newSelectedCategories);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ display: "flex", flexWrap: "wrap", mx: -1.5, mb: 3 }}>
        <Box sx={{ p: 1.5, width: { xs: "100%", md: "40%" } }}>
          <TextField
            fullWidth
            label="Search by Event Title"
            variant="outlined"
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
          />
        </Box>
        <Box sx={{ p: 1.5, width: { xs: "100%", md: "40%" } }}>
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
        <Box sx={{ p: 1.5, width: { xs: "100%", md: "20%" }, alignSelf: "center" }}>
          <Button variant="outlined" onClick={onResetFilters} startIcon={<ReplayIcon />} fullWidth>
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
          <Accordion sx={{ position: "relative" }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Filter by Category</Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                zIndex: 10,
                backgroundColor: theme.palette.background.paper,
                boxShadow: theme.shadows[3],
                borderBottomLeftRadius: theme.shape.borderRadius,
                borderBottomRightRadius: theme.shape.borderRadius,
                p: 2,
              }}
            >
              <FormGroup sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, auto))" }}>
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
                    label={category}
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
