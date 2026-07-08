import { useCallback } from 'react';
import type { RocketLineupFilters } from '../../types/pageFilters';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
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
    <K extends keyof RocketLineupFilters>(field: K, value: RocketLineupFilters[K]) => {
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

  return (
    <div className="flex flex-col gap-4">
      <FilterSection title="Search">
        <div className="space-y-1.5">
          <Label htmlFor="rocket-pokemon-search">Search by Pokémon Name</Label>
          <Input
            id="rocket-pokemon-search"
            value={filters.pokemonSearch}
            onChange={(e) => handleFilterChange('pokemonSearch', e.target.value)}
          />
        </div>
        <label className="flex items-center gap-2.5 text-sm">
          <Checkbox
            checked={filters.encounterOnly}
            onCheckedChange={(checked) => handleFilterChange('encounterOnly', checked === true)}
          />
          Show Encounter Pokémon Only
        </label>
        <label className="flex items-center gap-2.5 text-sm">
          <Checkbox
            checked={filters.shinyOnly}
            onCheckedChange={(checked) => handleFilterChange('shinyOnly', checked === true)}
          />
          Show Shiny Available Only
        </label>
      </FilterSection>

      <Separator />
      <FilterSection title="Leaders">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Select leaders to display</span>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleFilterChange('selectedLeaders', availableLeaders)}
            >
              Select All
            </Button>
            <Button size="sm" variant="ghost" onClick={() => handleFilterChange('selectedLeaders', [])}>
              Clear All
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {availableLeaders.map((leader) => (
            <label key={leader} className="flex items-center gap-2.5 text-sm">
              <Checkbox
                checked={filters.selectedLeaders.includes(leader)}
                onCheckedChange={(checked) => handleLeaderChange(leader, checked === true)}
              />
              {leader}
            </label>
          ))}
        </div>
      </FilterSection>

      <Separator />
      <FilterSection title="Battle Slots">
        <p className="text-sm text-muted-foreground">Filter by battle slot position</p>
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map((slot) => (
            <label key={slot} className="flex items-center gap-2.5 text-sm">
              <Checkbox
                checked={filters.selectedSlots.includes(slot)}
                onCheckedChange={(checked) => handleSlotChange(slot, checked === true)}
              />
              {`Slot ${slot}${slot === 3 ? ' (Encounter Slot)' : ''}`}
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterActions onReset={onResetFilters} />
    </div>
  );
}

export default RocketLineupFilter;
