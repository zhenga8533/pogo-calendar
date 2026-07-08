import { useCallback } from 'react';
import type { EggPoolFilters } from '../../types/pageFilters';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { FilterActions, FilterSection } from './shared';

interface EggPoolFilterProps {
  filters: EggPoolFilters;
  onFilterChange: (newFilters: EggPoolFilters) => void;
  onResetFilters: () => void;
  availableEggTiers: string[];
  availableRarityTiers: string[];
}

function EggPoolFilter(props: EggPoolFilterProps) {
  const { filters, onFilterChange, onResetFilters, availableEggTiers, availableRarityTiers } =
    props;

  const handleFilterChange = useCallback(
    <K extends keyof EggPoolFilters>(field: K, value: EggPoolFilters[K]) => {
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

  return (
    <div className="flex flex-col gap-4">
      <FilterSection title="Search">
        <div className="space-y-1.5">
          <Label htmlFor="egg-pokemon-search">Search by Pokémon Name</Label>
          <Input
            id="egg-pokemon-search"
            value={filters.pokemonSearch}
            onChange={(e) => handleFilterChange('pokemonSearch', e.target.value)}
          />
        </div>
        <label className="flex items-center gap-2.5 text-sm">
          <Checkbox
            checked={filters.shinyOnly}
            onCheckedChange={(checked) => handleFilterChange('shinyOnly', checked === true)}
          />
          Show Shiny Available Only
        </label>
      </FilterSection>

      <Separator />
      <FilterSection title="Egg Tiers">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Select egg types to display</span>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleFilterChange('selectedEggTiers', availableEggTiers)}
            >
              Select All
            </Button>
            <Button size="sm" variant="ghost" onClick={() => handleFilterChange('selectedEggTiers', [])}>
              Clear All
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {availableEggTiers.map((tier) => (
            <label key={tier} className="flex items-center gap-2.5 text-sm">
              <Checkbox
                checked={filters.selectedEggTiers.includes(tier)}
                onCheckedChange={(checked) => handleEggTierChange(tier, checked === true)}
              />
              {tier}
            </label>
          ))}
        </div>
      </FilterSection>

      <Separator />
      <FilterSection title="Rarity Tiers">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Select rarity levels to display</span>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleFilterChange('selectedRarityTiers', availableRarityTiers)}
            >
              Select All
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleFilterChange('selectedRarityTiers', [])}
            >
              Clear All
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {availableRarityTiers.map((tier) => (
            <label key={tier} className="flex items-center gap-2.5 text-sm">
              <Checkbox
                checked={filters.selectedRarityTiers.includes(tier)}
                onCheckedChange={(checked) => handleRarityTierChange(tier, checked === true)}
              />
              {tier}
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterActions onReset={onResetFilters} />
    </div>
  );
}

export default EggPoolFilter;
