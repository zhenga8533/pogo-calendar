import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ReplayIcon from '@mui/icons-material/Replay';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Slider,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import React, { useCallback, useMemo } from 'react';
import { SAVED_EVENTS_CATEGORY } from '../../config/constants';
import { categoryGroups, marks } from '../../config/eventFilter';
import type { EventFilterProps, Filters } from '../../types/filters';
import { formatHour } from '../../utils/dateUtils';
import AdvancedFilter from './AdvancedFilter';
import { ColorKeyLabel } from './ColorKeyLabel';

// --- Reusable CategoryCheckbox Component ---
interface CategoryCheckboxProps {
  category: string;
  isChecked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CategoryCheckbox = React.memo(
  ({ category, isChecked, onChange }: CategoryCheckboxProps) => {
    return (
      <FormControlLabel
        key={category}
        control={
          <Checkbox checked={isChecked} onChange={onChange} name={category} />
        }
        label={<ColorKeyLabel category={category} />}
      />
    );
  }
);

const FilterSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <Box sx={{ mb: 3 }}>
    <Typography variant="h6" component="h3" fontWeight="bold" gutterBottom>
      {title}
    </Typography>
    <Stack spacing={2} sx={{ mt: 1 }}>
      {children}
    </Stack>
  </Box>
);

function EventFilter(props: EventFilterProps) {
  const {
    filters,
    onFilterChange,
    allCategories,
    onNewEventClick,
    onResetFilters,
    onOpenExportDialog,
  } = props;

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
      handleFilterChange('selectedCategories', newSelectedCategories);
    },
    [filters.selectedCategories, handleFilterChange]
  );

  const handleSelectAll = useCallback(() => {
    const all = [SAVED_EVENTS_CATEGORY, ...allCategories];
    handleFilterChange('selectedCategories', all);
  }, [allCategories, handleFilterChange]);

  const handleClearAll = useCallback(() => {
    handleFilterChange('selectedCategories', []);
  }, [handleFilterChange]);

  const otherCategories = useMemo(
    () =>
      allCategories.filter(
        (cat) => !Object.values(categoryGroups).flat().includes(cat)
      ),
    [allCategories]
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Card
        sx={{
          width: { xs: '100%', md: '450px' },
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Stack spacing={4}>
            {/* Search & Filter Section */}
            <FilterSection title="Search & Filter">
              <TextField
                fullWidth
                label="Search by Event Title"
                variant="outlined"
                value={filters.searchTerm}
                onChange={(e) =>
                  handleFilterChange('searchTerm', e.target.value)
                }
              />
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={2}
                sx={{
                  '& .MuiFormControl-root': { width: '100%' },
                }}
              >
                <DatePicker
                  label="Start Date"
                  value={filters.startDate}
                  onChange={(date) => handleFilterChange('startDate', date)}
                  slotProps={{ textField: { variant: 'outlined' } }}
                />
                <DatePicker
                  label="End Date"
                  value={filters.endDate}
                  onChange={(date) => handleFilterChange('endDate', date)}
                  slotProps={{ textField: { variant: 'outlined' } }}
                />
              </Stack>
              <Box sx={{ px: 1, mt: 2 }}>
                <Typography gutterBottom variant="body2" color="text.secondary">
                  Time of Day
                </Typography>
                <Slider
                  value={filters.timeRange}
                  onChange={(_, value) =>
                    handleFilterChange('timeRange', value as number[])
                  }
                  valueLabelFormat={formatHour}
                  valueLabelDisplay="auto"
                  marks={marks}
                  min={0}
                  max={24}
                  step={1}
                />
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={filters.showActiveOnly}
                    onChange={(e) =>
                      handleFilterChange('showActiveOnly', e.target.checked)
                    }
                  />
                }
                label="Show Active Events Only"
                sx={{ ml: -0.5 }}
              />
            </FilterSection>

            {/* Categories Section */}
            <Divider />
            <FilterSection title="Categories">
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
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
              <Stack spacing={1}>
                {Object.entries(categoryGroups).map(
                  ([groupName, categories]) => {
                    const groupCategories = categories.filter((c) =>
                      allCategories.includes(c)
                    );
                    if (groupCategories.length === 0) {
                      return null;
                    }
                    return (
                      <Accordion key={groupName} defaultExpanded={false}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="body1" fontWeight="bold">
                            {groupName}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <FormGroup>
                            {groupName === 'Major Events' && (
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={filters.selectedCategories.includes(
                                      SAVED_EVENTS_CATEGORY
                                    )}
                                    onChange={handleCategoryChange}
                                    name={SAVED_EVENTS_CATEGORY}
                                    icon={<StarBorderIcon />}
                                    checkedIcon={<StarIcon />}
                                  />
                                }
                                label={
                                  <ColorKeyLabel category="Saved Events" />
                                }
                              />
                            )}
                            {groupCategories.map((category) => (
                              <CategoryCheckbox
                                key={category}
                                category={category}
                                isChecked={filters.selectedCategories.includes(
                                  category
                                )}
                                onChange={handleCategoryChange}
                              />
                            ))}
                          </FormGroup>
                        </AccordionDetails>
                      </Accordion>
                    );
                  }
                )}
                {otherCategories.length > 0 && (
                  <Accordion defaultExpanded={false}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="body1" fontWeight="bold">
                        Other Categories
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <FormGroup>
                        {otherCategories.map((category) => (
                          <CategoryCheckbox
                            key={category}
                            category={category}
                            isChecked={filters.selectedCategories.includes(
                              category
                            )}
                            onChange={handleCategoryChange}
                          />
                        ))}
                      </FormGroup>
                    </AccordionDetails>
                  </Accordion>
                )}
              </Stack>
            </FilterSection>

            {/* Advanced Section */}
            <Divider />
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" component="h3" fontWeight="bold">
                  Advanced Filters
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

            {/* Action Buttons */}
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              sx={{
                justifyContent: { xs: 'flex-start', md: 'flex-end' },
                flexWrap: 'wrap',
                mt: 3,
              }}
            >
              <Button
                variant="outlined"
                startIcon={<ReplayIcon />}
                onClick={onResetFilters}
              >
                Reset
              </Button>
              <Button
                variant="outlined"
                startIcon={<FileDownloadIcon />}
                onClick={onOpenExportDialog}
              >
                Export
              </Button>
              <Button
                variant="contained"
                startIcon={<AddCircleOutlineIcon />}
                onClick={onNewEventClick}
              >
                New Event
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}

export default EventFilter;
