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
import type { EggPoolFilters } from '../../types/pageFilters';
import { FilterActions, FilterSection } from './shared';

interface EggPoolFilterProps {
  filters: EggPoolFilters;
  onFilterChange: (newFilters: EggPoolFilters) => void;
  onResetFilters: () => void;
  availableEggTiers: string[];
  availableRarityTiers: string[];
}

function EggPoolFilter(props: EggPoolFilterProps) {
  const {
    filters,
    onFilterChange,
    onResetFilters,
    availableEggTiers,
    availableRarityTiers,
  } = props;

  const handleFilterChange = useCallback(
    (field: keyof EggPoolFilters, value: any) => {
      onFilterChange({ ...filters, [field]: value });
    },
    [filters, onFilterChange]
  );

  const handleEggTierChange = useCallback(
    (tier: string, checked: boolean) => {
      const newSelectedTiers = checked
        ? [...filters.selectedEggTiers, tier]
        : filters.selectedEggTiers.filter((t) => t !== tier);
      handleFilterChange('selectedEggTiers', newSelectedTiers);
    },
    [filters.selectedEggTiers, handleFilterChange]
  );

  const handleRarityTierChange = useCallback(
    (tier: string, checked: boolean) => {
      const newSelectedTiers = checked
        ? [...filters.selectedRarityTiers, tier]
        : filters.selectedRarityTiers.filter((t) => t !== tier);
      handleFilterChange('selectedRarityTiers', newSelectedTiers);
    },
    [filters.selectedRarityTiers, handleFilterChange]
  );

  const handleSelectAllEggTiers = useCallback(() => {
    handleFilterChange('selectedEggTiers', availableEggTiers);
  }, [availableEggTiers, handleFilterChange]);

  const handleClearAllEggTiers = useCallback(() => {
    handleFilterChange('selectedEggTiers', []);
  }, [handleFilterChange]);

  const handleSelectAllRarityTiers = useCallback(() => {
    handleFilterChange('selectedRarityTiers', availableRarityTiers);
  }, [availableRarityTiers, handleFilterChange]);

  const handleClearAllRarityTiers = useCallback(() => {
    handleFilterChange('selectedRarityTiers', []);
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

      {/* Egg Tiers Section */}
      <Divider />
      <FilterSection title="Egg Tiers">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="body2" color="text.secondary">
            Select egg types to display
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button size="small" onClick={handleSelectAllEggTiers}>
              Select All
            </Button>
            <Button size="small" onClick={handleClearAllEggTiers}>
              Clear All
            </Button>
          </Stack>
        </Stack>
        <FormGroup>
          {availableEggTiers.map((tier) => (
            <FormControlLabel
              key={tier}
              control={
                <Checkbox
                  checked={filters.selectedEggTiers.includes(tier)}
                  onChange={(e) => handleEggTierChange(tier, e.target.checked)}
                />
              }
              label={tier}
            />
          ))}
        </FormGroup>
      </FilterSection>

      {/* Rarity Tiers Section */}
      <Divider />
      <FilterSection title="Rarity Tiers">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="body2" color="text.secondary">
            Select rarity levels to display
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button size="small" onClick={handleSelectAllRarityTiers}>
              Select All
            </Button>
            <Button size="small" onClick={handleClearAllRarityTiers}>
              Clear All
            </Button>
          </Stack>
        </Stack>
        <FormGroup>
          {availableRarityTiers.map((tier) => (
            <FormControlLabel
              key={tier}
              control={
                <Checkbox
                  checked={filters.selectedRarityTiers.includes(tier)}
                  onChange={(e) =>
                    handleRarityTierChange(tier, e.target.checked)
                  }
                />
              }
              label={tier}
            />
          ))}
        </FormGroup>
      </FilterSection>

      <FilterActions onReset={onResetFilters} />
    </Stack>
  );
}

export default EggPoolFilter;
