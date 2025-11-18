import {
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useCallback } from 'react';
import type { RocketLineupFilters } from '../../types/pageFilters';
import { FilterActions, FilterSection } from './shared';

interface RocketLineupFilterProps {
  filters: RocketLineupFilters;
  onFilterChange: (newFilters: RocketLineupFilters) => void;
  onResetFilters: () => void;
  availableLeaders: string[];
}

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
    <Stack
      spacing={4}
      sx={{
        width: { xs: '100%', md: '450px' },
        p: { xs: 3, md: 4 },
        backgroundColor: 'background.paper',
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      {/* Search Section */}
      <FilterSection title="Search">
        <TextField
          fullWidth
          label="Search by Pokémon Name"
          variant="outlined"
          value={filters.pokemonSearch}
          onChange={(e) => handleFilterChange('pokemonSearch', e.target.value)}
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
                  onChange={(e) => handleLeaderChange(leader, e.target.checked)}
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
                  onChange={(e) => handleSlotChange(slot, e.target.checked)}
                />
              }
              label={`Slot ${slot}${slot === 3 ? ' (Encounter Slot)' : ''}`}
            />
          ))}
        </FormGroup>
      </FilterSection>

      <FilterActions onReset={onResetFilters} />
    </Stack>
  );
}

export default RocketLineupFilter;
