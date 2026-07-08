import { useCallback } from 'react';
import type { ResearchTaskFilters } from '../../types/pageFilters';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { FilterActions, FilterSection } from './shared';

interface ResearchTaskFilterProps {
  filters: ResearchTaskFilters;
  onFilterChange: (newFilters: ResearchTaskFilters) => void;
  onResetFilters: () => void;
  availableCategories: string[];
}

function ResearchTaskFilter(props: ResearchTaskFilterProps) {
  const { filters, onFilterChange, onResetFilters, availableCategories } = props;

  const handleFilterChange = useCallback(
    <K extends keyof ResearchTaskFilters>(field: K, value: ResearchTaskFilters[K]) => {
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

  return (
    <div className="flex flex-col gap-4">
      <FilterSection title="Search">
        <div className="space-y-1.5">
          <Label htmlFor="research-task-search">Search by Task Description</Label>
          <Input
            id="research-task-search"
            value={filters.taskSearch}
            onChange={(e) => handleFilterChange('taskSearch', e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="research-pokemon-search">Search by Pokémon Reward</Label>
          <Input
            id="research-pokemon-search"
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
      <FilterSection title="Reward Types">
        <label className="flex items-center gap-2.5 text-sm">
          <Checkbox
            checked={filters.rewardTypes.includes('encounter')}
            onCheckedChange={(checked) => handleRewardTypeChange('encounter', checked === true)}
          />
          Pokémon Encounters
        </label>
        <label className="flex items-center gap-2.5 text-sm">
          <Checkbox
            checked={filters.rewardTypes.includes('item')}
            onCheckedChange={(checked) => handleRewardTypeChange('item', checked === true)}
          />
          Items
        </label>
      </FilterSection>

      <Separator />
      <FilterSection title="Task Categories">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Select task categories</span>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleFilterChange('selectedCategories', availableCategories)}
            >
              Select All
            </Button>
            <Button size="sm" variant="ghost" onClick={() => handleFilterChange('selectedCategories', [])}>
              Clear All
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {availableCategories.map((category) => (
            <label key={category} className="flex items-center gap-2.5 text-sm">
              <Checkbox
                checked={filters.selectedCategories.includes(category)}
                onCheckedChange={(checked) => handleCategoryChange(category, checked === true)}
              />
              {category}
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterActions onReset={onResetFilters} />
    </div>
  );
}

export default ResearchTaskFilter;
