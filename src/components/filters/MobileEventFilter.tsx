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
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import React from "react";
import { formatTime, marks, SAVED_EVENTS_CATEGORY } from "../../config/eventFilter";
import type { EventFilterProps, Filters } from "../../types/filters";
import AdvancedFilter from "./AdvancedFilter";
import { CategoryCheckbox } from "./CategoryCheckbox";

interface MobileEventFilterProps extends Omit<EventFilterProps, "isMobile"> {
  handleFilterChange: (field: keyof Filters, value: any) => void;
  handleCategoryChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenExportDialog: () => void;
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Stack spacing={2}>
    <Typography variant="overline" color="text.secondary">
      {title}
    </Typography>
    {children}
  </Stack>
);

function MobileEventFilterComponent({
  filters,
  onNewEventClick,
  onResetFilters,
  onOpenExportDialog,
  allCategories,
  handleFilterChange,
  handleCategoryChange,
  allPokemon,
  allBonuses,
}: MobileEventFilterProps) {
  return (
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
            allPokemon={allPokemon}
            allBonuses={allBonuses}
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
  );
}

export const MobileEventFilter = React.memo(MobileEventFilterComponent);
