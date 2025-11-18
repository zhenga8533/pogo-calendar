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
import type { RocketLineupFilters } from '../../types/pageFilters';

interface RocketLineupFilterProps {
  filters: RocketLineupFilters;
  onFilterChange: (newFilters: RocketLineupFilters) => void;
  onResetFilters: () => void;
  availableLeaders: string[];
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

function RocketLineupFilter(props: RocketLineupFilterProps) {
  const { filters, onFilterChange, onResetFilters, availableLeaders } = props;

  const handleFilterChange = useCallback(
    (field: keyof RocketLineupFilters, value: any) => {
      onFilterChange({ ...filters, [field]: value });
    },
    [filters, onFilterChange]
  );

  const handleLeaderChange = useCallback(
    (leader: string, checked: boolean) => {
      const newSelectedLeaders = checked
        ? [...filters.selectedLeaders, leader]
        : filters.selectedLeaders.filter((l) => l !== leader);
      handleFilterChange('selectedLeaders', newSelectedLeaders);
    },
    [filters.selectedLeaders, handleFilterChange]
  );

  const handleSlotChange = useCallback(
    (slot: number, checked: boolean) => {
      const newSelectedSlots = checked
        ? [...filters.selectedSlots, slot]
        : filters.selectedSlots.filter((s) => s !== slot);
      handleFilterChange('selectedSlots', newSelectedSlots);
    },
    [filters.selectedSlots, handleFilterChange]
  );

  const handleSelectAllLeaders = useCallback(() => {
    handleFilterChange('selectedLeaders', availableLeaders);
  }, [availableLeaders, handleFilterChange]);

  const handleClearAllLeaders = useCallback(() => {
    handleFilterChange('selectedLeaders', []);
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
              label="Search by Pokémon Name"
              variant="outlined"
              value={filters.pokemonSearch}
              onChange={(e) =>
                handleFilterChange('pokemonSearch', e.target.value)
              }
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.encounterOnly}
                  onChange={(e) =>
                    handleFilterChange('encounterOnly', e.target.checked)
                  }
                />
              }
              label="Show Encounter Pokémon Only"
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

          {/* Leaders Section */}
          <Divider />
          <FilterSection title="Leaders">
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="body2" color="text.secondary">
                Select leaders to display
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button size="small" onClick={handleSelectAllLeaders}>
                  Select All
                </Button>
                <Button size="small" onClick={handleClearAllLeaders}>
                  Clear All
                </Button>
              </Stack>
            </Stack>
            <FormGroup>
              {availableLeaders.map((leader) => (
                <FormControlLabel
                  key={leader}
                  control={
                    <Checkbox
                      checked={filters.selectedLeaders.includes(leader)}
                      onChange={(e) =>
                        handleLeaderChange(leader, e.target.checked)
                      }
                    />
                  }
                  label={leader}
                />
              ))}
            </FormGroup>
          </FilterSection>

          {/* Slots Section */}
          <Divider />
          <FilterSection title="Battle Slots">
            <Typography variant="body2" color="text.secondary">
              Filter by battle slot position
            </Typography>
            <FormGroup>
              {[1, 2, 3].map((slot) => (
                <FormControlLabel
                  key={slot}
                  control={
                    <Checkbox
                      checked={filters.selectedSlots.includes(slot)}
                      onChange={(e) =>
                        handleSlotChange(slot, e.target.checked)
                      }
                    />
                  }
                  label={`Slot ${slot}${slot === 3 ? ' (Encounter Slot)' : ''}`}
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

export default RocketLineupFilter;
