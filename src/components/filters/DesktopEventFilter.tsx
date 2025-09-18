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
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import React, { useMemo } from "react";
import { categoryGroups, SAVED_EVENTS_CATEGORY } from "../../config/eventFilter";
import type { EventFilterProps, Filters } from "../../types/filters";
import AdvancedFilter from "./AdvancedFilter";
import { CategoryCheckbox } from "./CategoryCheckbox";
import { ColorKeyLabel } from "./ColorKeyLabel";

interface DesktopEventFilterProps extends Omit<EventFilterProps, "isMobile"> {
  handleFilterChange: (field: keyof Filters, value: any) => void;
  handleCategoryChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectAll: () => void;
  handleClearAll: () => void;
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Stack spacing={2}>
    <Typography variant="overline" color="text.secondary">
      {title}
    </Typography>
    {children}
  </Stack>
);

function DesktopEventFilterComponent(props: DesktopEventFilterProps) {
  const {
    filters,
    onNewEventClick,
    onResetFilters,
    onOpenExportDialog,
    allCategories,
    handleFilterChange,
    handleCategoryChange,
    handleSelectAll,
    handleClearAll,
  } = props;

  const otherCategories = useMemo(
    () => allCategories.filter((cat) => !Object.values(categoryGroups).flat().includes(cat)),
    [allCategories]
  );

  return (
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
  );
}

export const DesktopEventFilter = React.memo(DesktopEventFilterComponent);
