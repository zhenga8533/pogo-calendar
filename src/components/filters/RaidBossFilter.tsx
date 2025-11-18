import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Slider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useCallback } from 'react';
import type { RaidBossFilters } from '../../types/pageFilters';
import { FilterActions, FilterSection } from './shared';

interface RaidBossFilterProps {
  filters: RaidBossFilters;
  onFilterChange: (newFilters: RaidBossFilters) => void;
  onResetFilters: () => void;
  availableRaidTiers: string[];
  availableTypes: string[];
}

function RaidBossFilter(props: RaidBossFilterProps) {
  const {
    filters,
    onFilterChange,
    onResetFilters,
    availableRaidTiers,
    availableTypes,
  } = props;

  const handleFilterChange = useCallback(
    (field: keyof RaidBossFilters, value: any) => {
      onFilterChange({ ...filters, [field]: value });
    },
    [filters, onFilterChange]
  );

  const handleRaidTierChange = useCallback(
    (tier: string, checked: boolean) => {
      const newSelectedTiers = checked
        ? [...filters.selectedRaidTiers, tier]
        : filters.selectedRaidTiers.filter((t) => t !== tier);
      handleFilterChange('selectedRaidTiers', newSelectedTiers);
    },
    [filters.selectedRaidTiers, handleFilterChange]
  );

  const handleTypeChange = useCallback(
    (type: string, checked: boolean) => {
      const newSelectedTypes = checked
        ? [...filters.selectedTypes, type]
        : filters.selectedTypes.filter((t) => t !== type);
      handleFilterChange('selectedTypes', newSelectedTypes);
    },
    [filters.selectedTypes, handleFilterChange]
  );

  const handleSelectAllRaidTiers = useCallback(() => {
    handleFilterChange('selectedRaidTiers', availableRaidTiers);
  }, [availableRaidTiers, handleFilterChange]);

  const handleClearAllRaidTiers = useCallback(() => {
    handleFilterChange('selectedRaidTiers', []);
  }, [handleFilterChange]);

  const handleSelectAllTypes = useCallback(() => {
    handleFilterChange('selectedTypes', availableTypes);
  }, [availableTypes, handleFilterChange]);

  const handleClearAllTypes = useCallback(() => {
    handleFilterChange('selectedTypes', []);
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
              checked={filters.shinyOnly}
              onChange={(e) =>
                handleFilterChange('shinyOnly', e.target.checked)
              }
            />
          }
          label="Show Shiny Available Only"
        />
      </FilterSection>

      {/* CP Range Section */}
      <Divider />
      <FilterSection title="CP Range">
        <Box sx={{ px: 1 }}>
          <Typography gutterBottom variant="body2" color="text.secondary">
            Filter by CP Range
          </Typography>
          <Slider
            value={[filters.minCP, filters.maxCP]}
            onChange={(_, value) => {
              const [min, max] = value as number[];
              handleFilterChange('minCP', min);
              handleFilterChange('maxCP', max);
            }}
            valueLabelDisplay="auto"
            min={0}
            max={60000}
            step={1000}
            marks={[
              { value: 0, label: '0' },
              { value: 30000, label: '30k' },
              { value: 60000, label: '60k' },
            ]}
          />
        </Box>
      </FilterSection>

      {/* Raid Tiers Section */}
      <Divider />
      <FilterSection title="Raid Tiers">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="body2" color="text.secondary">
            Select raid tiers to display
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button size="small" onClick={handleSelectAllRaidTiers}>
              Select All
            </Button>
            <Button size="small" onClick={handleClearAllRaidTiers}>
              Clear All
            </Button>
          </Stack>
        </Stack>
        <FormGroup>
          {availableRaidTiers.map((tier) => (
            <FormControlLabel
              key={tier}
              control={
                <Checkbox
                  checked={filters.selectedRaidTiers.includes(tier)}
                  onChange={(e) => handleRaidTierChange(tier, e.target.checked)}
                />
              }
              label={tier}
            />
          ))}
        </FormGroup>
      </FilterSection>

      {/* Pokémon Types Section */}
      <Divider />
      <FilterSection title="Pokémon Types">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="body2" color="text.secondary">
            Select types to display
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button size="small" onClick={handleSelectAllTypes}>
              Select All
            </Button>
            <Button size="small" onClick={handleClearAllTypes}>
              Clear All
            </Button>
          </Stack>
        </Stack>
        <FormGroup>
          {availableTypes.map((type) => (
            <FormControlLabel
              key={type}
              control={
                <Checkbox
                  checked={filters.selectedTypes.includes(type)}
                  onChange={(e) => handleTypeChange(type, e.target.checked)}
                />
              }
              label={type}
            />
          ))}
        </FormGroup>
      </FilterSection>

      <FilterActions onReset={onResetFilters} />
    </Stack>
  );
}

export default RaidBossFilter;
