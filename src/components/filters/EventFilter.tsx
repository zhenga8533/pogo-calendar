import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FilterListIcon from "@mui/icons-material/FilterList";
import ReplayIcon from "@mui/icons-material/Replay";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Badge,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Menu,
  Paper,
  Slider,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import React, { useState } from "react";
import { getColorForCategory } from "../../utils/colorUtils";

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
  onNewEventClick: () => void;
  allCategories: string[];
  isMobile: boolean;
}

const marks = [
  { value: 0, label: "12 AM" },
  { value: 6, label: "6 AM" },
  { value: 12, label: "12 PM" },
  { value: 18, label: "6 PM" },
  { value: 24, label: "12 AM" },
];

const categoryGroups = {
  "Major Events": ["City Safari", "Community Day", "Raid Day", "Raid Weekend", "Wild Area"],
  "Weekly Events": ["Raid Hour", "Pokémon Spotlight Hour", "Max Mondays"],
};

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
      <Typography variant="body2">{category}</Typography>
    </Box>
  );
}

/**
 * EventFilter component to filter events by search term, date range, time range, and categories.
 *
 * @param param0 Props containing filters, change handlers, categories, and mobile view flag.
 * @returns The rendered EventFilter component.
 */
function EventFilter({
  filters,
  onFilterChange,
  onResetFilters,
  onNewEventClick,
  allCategories,
  isMobile,
}: EventFilterProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // Menu open/close handlers
  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle changes to any filter field
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

  // Handle select all categories
  const handleSelectAll = () => {
    const all = ["Saved", ...allCategories];
    handleFilterChange("selectedCategories", all);
  };

  // Handle clear all categories
  const handleClearAll = () => {
    handleFilterChange("selectedCategories", []);
  };

  const otherCategories = allCategories.filter((cat) => !Object.values(categoryGroups).flat().includes(cat));

  // Category filter content for menu and accordion
  const categoryFilterContent = (
    <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 1, md: 4 }}>
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
        {Object.entries(categoryGroups).map(([groupName, categories]) => (
          <React.Fragment key={groupName}>
            <Typography variant="overline" color="text.secondary">
              {groupName}
            </Typography>
            {categories
              .filter((c) => allCategories.includes(c))
              .map((category) => (
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
          </React.Fragment>
        ))}
      </FormGroup>
      <FormGroup>
        <Typography variant="overline" color="text.secondary">
          Other
        </Typography>
        {otherCategories.map((category) => (
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
    </Stack>
  );

  // Render mobile layout if isMobile is true
  if (isMobile) {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
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
          <DatePicker
            label="End Date"
            value={filters.endDate}
            onChange={(date) => handleFilterChange("endDate", date)}
          />
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
            <AccordionDetails>{categoryFilterContent}</AccordionDetails>
          </Accordion>
          <Button variant="contained" onClick={onNewEventClick} startIcon={<AddCircleOutlineIcon />}>
            New Event
          </Button>
          <Button variant="outlined" onClick={onResetFilters} startIcon={<ReplayIcon />}>
            Reset All Filters
          </Button>
        </Stack>
      </LocalizationProvider>
    );
  }

  // Render desktop layout
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Search by Event Title"
            variant="outlined"
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
          />
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
          <Stack direction="row" spacing={2} justifyContent="space-between">
            <Badge badgeContent={filters.selectedCategories.length} color="primary">
              <Button variant="outlined" startIcon={<FilterListIcon />} onClick={handleMenuClick}>
                Categories
              </Button>
            </Badge>
            <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
              <Box sx={{ p: 2, width: { xs: "280px", md: "550px" } }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="h6" component="div">
                    Categories
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Button size="small" onClick={handleSelectAll}>
                      Select All
                    </Button>
                    <Button size="small" onClick={handleClearAll}>
                      Clear All
                    </Button>
                  </Stack>
                </Stack>
                <Divider sx={{ mb: 2 }} />
                {categoryFilterContent}
              </Box>
            </Menu>
            <Stack direction="row" spacing={2}>
              <Button variant="contained" onClick={onNewEventClick} startIcon={<AddCircleOutlineIcon />}>
                New Event
              </Button>
              <Button variant="outlined" onClick={onResetFilters} startIcon={<ReplayIcon />}>
                Reset
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Paper>
    </LocalizationProvider>
  );
}

export default EventFilter;
