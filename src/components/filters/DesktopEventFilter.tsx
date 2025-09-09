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
import React from "react";
import { ColorKeyLabel } from "./ColorKeyLabel";
import { type EventFilterProps, type Filters, categoryGroups, dayOptions, formatTime, marks } from "./EventFilter";

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

/**
 * DesktopEventFilter component to render the desktop version of the event filter.
 *
 * @param {DesktopEventFilterProps} props Props containing filters, change handlers, categories, and menu state.
 * @returns {React.ReactElement} The rendered DesktopEventFilter component.
 */
export function DesktopEventFilter({
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
  const otherCategories = allCategories.filter((cat) => !Object.values(categoryGroups).flat().includes(cat));

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Stack spacing={2}>
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
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
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
            </Box>
          </Menu>
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
    </Paper>
  );
}
