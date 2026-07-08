import { Download, Plus, RotateCcw, Star } from 'lucide-react';
import React, { useCallback, useMemo } from 'react';
import { SAVED_EVENTS_CATEGORY } from '../../config/constants';
import { categoryGroups, marks } from '../../config/eventFilter';
import type { EventFilterProps, Filters } from '../../types/filters';
import { formatHour } from '../../utils/dateUtils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { DatePickerField } from '../ui/date-picker';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { Slider } from '../ui/slider';
import { Switch } from '../ui/switch';
import AdvancedFilter from './AdvancedFilter';
import { ColorKeyLabel } from './ColorKeyLabel';
import { FilterSection } from './shared';

interface CategoryCheckboxProps {
  category: string;
  isChecked: boolean;
  onChange: (checked: boolean) => void;
  starred?: boolean;
}

const CategoryCheckbox = React.memo(
  ({ category, isChecked, onChange, starred }: CategoryCheckboxProps) => {
    return (
      <label className="flex items-center gap-2.5 text-sm">
        {starred ? (
          <button
            type="button"
            onClick={() => onChange(!isChecked)}
            className="flex h-4.5 w-4.5 items-center justify-center text-muted-foreground"
            aria-pressed={isChecked}
          >
            <Star
              className="h-4 w-4"
              fill={isChecked ? 'currentColor' : 'none'}
              style={isChecked ? { color: 'hsl(var(--warning))' } : undefined}
            />
          </button>
        ) : (
          <Checkbox checked={isChecked} onCheckedChange={(c) => onChange(c === true)} />
        )}
        <ColorKeyLabel category={starred ? 'Saved Events' : category} />
      </label>
    );
  }
);
CategoryCheckbox.displayName = 'CategoryCheckbox';

function EventFilter(props: EventFilterProps) {
  const { filters, onFilterChange, allCategories, onNewEventClick, onResetFilters, onOpenExportDialog } =
    props;

  const handleFilterChange = useCallback(
    <K extends keyof Filters>(field: K, value: Filters[K]) => {
      onFilterChange({ ...filters, [field]: value });
    },
    [filters, onFilterChange]
  );

  const handleCategoryToggle = useCallback(
    (category: string, checked: boolean) => {
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
    () => allCategories.filter((cat) => !Object.values(categoryGroups).flat().includes(cat)),
    [allCategories]
  );

  return (
    <div className="flex flex-col gap-4">
      <FilterSection title="Search & Filter">
        <div className="space-y-1.5">
          <Label htmlFor="event-search">Search by Event Title</Label>
          <Input
            id="event-search"
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="flex-1 space-y-1.5">
            <Label>Start Date</Label>
            <DatePickerField
              value={filters.startDate}
              onChange={(date) => handleFilterChange('startDate', date)}
            />
          </div>
          <div className="flex-1 space-y-1.5">
            <Label>End Date</Label>
            <DatePickerField value={filters.endDate} onChange={(date) => handleFilterChange('endDate', date)} />
          </div>
        </div>
        <div className="px-1 pt-2">
          <p className="mb-2 text-sm text-muted-foreground">Time of Day</p>
          <Slider
            value={filters.timeRange}
            onValueChange={(value) => handleFilterChange('timeRange', value)}
            min={0}
            max={24}
            step={1}
            marks={marks}
            formatLabel={formatHour}
          />
        </div>
        <label className="flex items-center gap-3 text-sm">
          <Switch
            checked={filters.showActiveOnly}
            onCheckedChange={(checked) => handleFilterChange('showActiveOnly', checked)}
          />
          Show Active Events Only
        </label>
      </FilterSection>

      <Separator />
      <FilterSection title="Categories">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Select categories to display</span>
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" onClick={handleSelectAll}>
              Select All
            </Button>
            <Button size="sm" variant="ghost" onClick={handleClearAll}>
              Clear All
            </Button>
          </div>
        </div>
        <Accordion type="multiple" className="flex flex-col">
          {Object.entries(categoryGroups).map(([groupName, categories]) => {
            const groupCategories = categories.filter((c) => allCategories.includes(c));
            if (groupCategories.length === 0) return null;
            return (
              <AccordionItem key={groupName} value={groupName}>
                <AccordionTrigger className="text-sm">{groupName}</AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-2.5">
                    {groupName === 'Major Events' && (
                      <CategoryCheckbox
                        category={SAVED_EVENTS_CATEGORY}
                        starred
                        isChecked={filters.selectedCategories.includes(SAVED_EVENTS_CATEGORY)}
                        onChange={(checked) => handleCategoryToggle(SAVED_EVENTS_CATEGORY, checked)}
                      />
                    )}
                    {groupCategories.map((category) => (
                      <CategoryCheckbox
                        key={category}
                        category={category}
                        isChecked={filters.selectedCategories.includes(category)}
                        onChange={(checked) => handleCategoryToggle(category, checked)}
                      />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
          {otherCategories.length > 0 && (
            <AccordionItem value="other">
              <AccordionTrigger className="text-sm">Other Categories</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-2.5">
                  {otherCategories.map((category) => (
                    <CategoryCheckbox
                      key={category}
                      category={category}
                      isChecked={filters.selectedCategories.includes(category)}
                      onChange={(checked) => handleCategoryToggle(category, checked)}
                    />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </FilterSection>

      <Separator />
      <Accordion type="single" collapsible>
        <AccordionItem value="advanced">
          <AccordionTrigger className="text-base font-bold">Advanced Filters</AccordionTrigger>
          <AccordionContent>
            <AdvancedFilter
              filters={filters}
              handleFilterChange={handleFilterChange}
              allPokemon={props.allPokemon}
              allBonuses={props.allBonuses}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Separator />
      <div className="flex flex-col flex-wrap gap-2 md:flex-row md:justify-end">
        <Button variant="outline" onClick={onResetFilters}>
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
        <Button variant="outline" onClick={onOpenExportDialog}>
          <Download className="h-4 w-4" />
          Export
        </Button>
        <Button onClick={onNewEventClick}>
          <Plus className="h-4 w-4" />
          New Event
        </Button>
      </div>
    </div>
  );
}

export default EventFilter;
