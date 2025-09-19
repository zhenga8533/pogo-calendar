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
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import React, { useCallback, useMemo } from "react";
import { SAVED_EVENTS_CATEGORY } from "../../config/constants";
import { categoryGroups, marks } from "../../config/eventFilter";
import type { EventFilterProps, Filters } from "../../types/filters";
import { formatHour } from "../../utils/dateUtils";
import AdvancedFilter from "./AdvancedFilter";
import { ColorKeyLabel } from "./ColorKeyLabel";

// --- Merged CategoryCheckbox Component ---
interface CategoryCheckboxProps {
  category: string;
  isChecked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CategoryCheckbox = React.memo(function CategoryCheckbox({
  category,
  isChecked,
  onChange,
}: CategoryCheckboxProps) {
  return (
    <FormControlLabel
      key={category}
      control={<Checkbox checked={isChecked} onChange={onChange} name={category} />}
      label={<ColorKeyLabel category={category} />}
    />
  );
});
// ------------------------------------

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Stack spacing={2}>
    <Typography variant="overline" color="text.secondary">
      {title}
    </Typography>
    {children}
  </Stack>
);

function EventFilter(props: EventFilterProps) {
  const { filters, onFilterChange, allCategories, isMobile, onNewEventClick, onResetFilters, onOpenExportDialog } =
    props;

  const handleFilterChange = useCallback(
    (field: keyof Filters, value: any) => {
      onFilterChange({ ...filters, [field]: value });
    },
    [filters, onFilterChange]
  );

  const handleCategoryChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name: category, checked } = event.target;
      const newSelectedCategories = checked
        ? [...filters.selectedCategories, category]
        : filters.selectedCategories.filter((c) => c !== category);
      handleFilterChange("selectedCategories", newSelectedCategories);
    },
    [filters.selectedCategories, handleFilterChange]
  );

  const handleSelectAll = useCallback(() => {
    const all = [SAVED_EVENTS_CATEGORY, ...allCategories];
    handleFilterChange("selectedCategories", all);
  }, [allCategories, handleFilterChange]);

  const handleClearAll = useCallback(() => {
    handleFilterChange("selectedCategories", []);
  }, [handleFilterChange]);

  const otherCategories = useMemo(
    () => allCategories.filter((cat) => !Object.values(categoryGroups).flat().includes(cat)),
    [allCategories]
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {isMobile ? (
        // Mobile Layout
        <Stack spacing={4}>
          <Section title="Search & Date">
            <TextField
              fullWidth
              label="Search by Event Title"
              variant="filled"
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
            />
            <DatePicker
              label="Start Date"
              value={filters.startDate}
              onChange={(date) => handleFilterChange("startDate", date)}
              slotProps={{ textField: { variant: "filled" } }}
            />
            <DatePicker
              label="End Date"
              value={filters.endDate}
              onChange={(date) => handleFilterChange("endDate", date)}
              slotProps={{ textField: { variant: "filled" } }}
            />
          </Section>

          <Section title="Time & Categories">
            <Box sx={{ px: 1 }}>
              <Typography gutterBottom variant="body2" color="text.secondary">
                Time of Day
              </Typography>
              <Slider
                value={filters.timeRange}
                onChange={(_, value) => handleFilterChange("timeRange", value as number[])}
                valueLabelFormat={formatHour}
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
                    control={
                      <Checkbox
                        checked={filters.selectedCategories.includes(SAVED_EVENTS_CATEGORY)}
                        onChange={handleCategoryChange}
                        name={SAVED_EVENTS_CATEGORY}
                        icon={<StarBorderIcon />}
                        checkedIcon={<StarIcon />}
                      />
                    }
                    label="Saved Events"
                  />
                  <Divider sx={{ my: 1 }} />
                  {allCategories.map((category) => (
                    <CategoryCheckbox
                      key={category}
                      category={category}
                      isChecked={filters.selectedCategories.includes(category)}
                      onChange={handleCategoryChange}
                    />
                  ))}
                </FormGroup>
              </AccordionDetails>
            </Accordion>
          </Section>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Advanced</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <AdvancedFilter
                filters={filters}
                handleFilterChange={handleFilterChange}
                allPokemon={props.allPokemon}
                allBonuses={props.allBonuses}
              />
            </AccordionDetails>
          </Accordion>

          <Section title="General">
            <FormControlLabel
              control={
                <Switch
                  checked={filters.showActiveOnly}
                  onChange={(e) => handleFilterChange("showActiveOnly", e.target.checked)}
                />
              }
              label="Show Active Events Only"
              labelPlacement="start"
              sx={{ justifyContent: "space-between", ml: 0 }}
            />
          </Section>

          <Stack spacing={2}>
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
        </Stack>
      ) : (
        // Desktop Layout
        <Stack spacing={4} sx={{ p: 3, width: { xs: "280px", md: "550px" } }}>
          <Section title="Search & Filter">
            <TextField
              fullWidth
              label="Search by Event Title"
              variant="filled"
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
            />
            <Stack direction="row" spacing={2}>
              <DatePicker
                label="Start Date"
                value={filters.startDate}
                onChange={(date) => handleFilterChange("startDate", date)}
                slotProps={{ textField: { variant: "filled" } }}
                sx={{ width: "100%" }}
              />
              <DatePicker
                label="End Date"
                value={filters.endDate}
                onChange={(date) => handleFilterChange("endDate", date)}
                slotProps={{ textField: { variant: "filled" } }}
                sx={{ width: "100%" }}
              />
            </Stack>
            <FormControlLabel
              control={
                <Switch
                  checked={filters.showActiveOnly}
                  onChange={(e) => handleFilterChange("showActiveOnly", e.target.checked)}
                />
              }
              label="Show Active Events Only"
              sx={{ justifyContent: "space-between", ml: 0 }}
              labelPlacement="start"
            />
          </Section>
          <Divider />
          <Section title="Categories">
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Select categories to display
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
            <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 1, md: 4 }}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filters.selectedCategories.includes(SAVED_EVENTS_CATEGORY)}
                      onChange={handleCategoryChange}
                      name={SAVED_EVENTS_CATEGORY}
                      icon={<StarBorderIcon />}
                      checkedIcon={<StarIcon />}
                    />
                  }
                  label={<ColorKeyLabel category={"Saved Events"} />}
                />
                {Object.entries(categoryGroups).map(([groupName, categories]) => (
                  <React.Fragment key={groupName}>
                    {categories
                      .filter((c) => allCategories.includes(c))
                      .map((category) => (
                        <CategoryCheckbox
                          key={category}
                          category={category}
                          isChecked={filters.selectedCategories.includes(category)}
                          onChange={handleCategoryChange}
                        />
                      ))}
                  </React.Fragment>
                ))}
              </FormGroup>
              {otherCategories.length > 0 && (
                <FormGroup>
                  {otherCategories.map((category) => (
                    <CategoryCheckbox
                      key={category}
                      category={category}
                      isChecked={filters.selectedCategories.includes(category)}
                      onChange={handleCategoryChange}
                    />
                  ))}
                </FormGroup>
              )}
            </Stack>
          </Section>
          <Divider />
          <Accordion sx={{ "&:before": { display: "none" } }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="overline" color="text.secondary">
                Advanced
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <AdvancedFilter
                filters={filters}
                handleFilterChange={handleFilterChange}
                allPokemon={props.allPokemon}
                allBonuses={props.allBonuses}
              />
            </AccordionDetails>
          </Accordion>
          <Divider />
          <Stack direction="row" spacing={2} justifyContent="flex-end">
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
      )}
    </LocalizationProvider>
  );
}

export default EventFilter;
