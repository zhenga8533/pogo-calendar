import ReplayIcon from '@mui/icons-material/Replay';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React, { useCallback } from 'react';
import type { ResearchTaskFilters } from '../../types/pageFilters';

interface ResearchTaskFilterProps {
  filters: ResearchTaskFilters;
  onFilterChange: (newFilters: ResearchTaskFilters) => void;
  onResetFilters: () => void;
  availableCategories: string[];
}

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

function ResearchTaskFilter(props: ResearchTaskFilterProps) {
  const { filters, onFilterChange, onResetFilters, availableCategories } =
    props;

  const handleFilterChange = useCallback(
    (field: keyof ResearchTaskFilters, value: any) => {
      onFilterChange({ ...filters, [field]: value });
    },
    [filters, onFilterChange]
  );

  const handleRewardTypeChange = useCallback(
    (type: string, checked: boolean) => {
      const newRewardTypes = checked
        ? [...filters.rewardTypes, type]
        : filters.rewardTypes.filter((t) => t !== type);
      handleFilterChange('rewardTypes', newRewardTypes);
    },
    [filters.rewardTypes, handleFilterChange]
  );

  const handleCategoryChange = useCallback(
    (category: string, checked: boolean) => {
      const newSelectedCategories = checked
        ? [...filters.selectedCategories, category]
        : filters.selectedCategories.filter((c) => c !== category);
      handleFilterChange('selectedCategories', newSelectedCategories);
    },
    [filters.selectedCategories, handleFilterChange]
  );

  const handleSelectAllCategories = useCallback(() => {
    handleFilterChange('selectedCategories', availableCategories);
  }, [availableCategories, handleFilterChange]);

  const handleClearAllCategories = useCallback(() => {
    handleFilterChange('selectedCategories', []);
  }, [handleFilterChange]);

  return (
    <Card
      sx={{
        width: { xs: '100%', md: '450px' },
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        <Stack spacing={4}>
          {/* Search Section */}
          <FilterSection title="Search">
            <TextField
              fullWidth
              label="Search by Task Description"
              variant="outlined"
              value={filters.taskSearch}
              onChange={(e) => handleFilterChange('taskSearch', e.target.value)}
            />
            <TextField
              fullWidth
              label="Search by Pokémon Reward"
              variant="outlined"
              value={filters.pokemonSearch}
              onChange={(e) =>
                handleFilterChange('pokemonSearch', e.target.value)
              }
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.shinyOnly}
                  onChange={(e) =>
                    handleFilterChange('shinyOnly', e.target.checked)
                  }
                />
              }
              label="Show Shiny Available Only"
            />
          </FilterSection>

          {/* Reward Type Section */}
          <Divider />
          <FilterSection title="Reward Types">
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.rewardTypes.includes('encounter')}
                    onChange={(e) =>
                      handleRewardTypeChange('encounter', e.target.checked)
                    }
                  />
                }
                label="Pokémon Encounters"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.rewardTypes.includes('item')}
                    onChange={(e) =>
                      handleRewardTypeChange('item', e.target.checked)
                    }
                  />
                }
                label="Items"
              />
            </FormGroup>
          </FilterSection>

          {/* Categories Section */}
          <Divider />
          <FilterSection title="Task Categories">
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="body2" color="text.secondary">
                Select task categories
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button size="small" onClick={handleSelectAllCategories}>
                  Select All
                </Button>
                <Button size="small" onClick={handleClearAllCategories}>
                  Clear All
                </Button>
              </Stack>
            </Stack>
            <FormGroup>
              {availableCategories.map((category) => (
                <FormControlLabel
                  key={category}
                  control={
                    <Checkbox
                      checked={filters.selectedCategories.includes(category)}
                      onChange={(e) =>
                        handleCategoryChange(category, e.target.checked)
                      }
                    />
                  }
                  label={category}
                />
              ))}
            </FormGroup>
          </FilterSection>

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
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default ResearchTaskFilter;
