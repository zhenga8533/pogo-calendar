import { Check, X } from 'lucide-react';
import { useState } from 'react';
import type { Filters } from '../../types/filters';
import { Badge } from '../ui/badge';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '../ui/combobox';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

interface AdvancedFilterProps {
  filters: Filters;
  handleFilterChange: <K extends keyof Filters>(field: K, value: Filters[K]) => void;
  allPokemon: string[];
  allBonuses: string[];
}

interface MultiSelectProps {
  label: string;
  placeholder: string;
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
}

function MultiSelect({ label, placeholder, options, value, onChange }: MultiSelectProps) {
  const [open, setOpen] = useState(false);

  const toggle = (option: string) => {
    onChange(value.includes(option) ? value.filter((v) => v !== option) : [...value, option]);
  };

  return (
    <div className="space-y-1.5">
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-sm text-left focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {value.length === 0 && <span className="text-muted-foreground">{placeholder}</span>}
            {value.map((v) => (
              <Badge key={v} variant="outline" className="gap-1">
                {v}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggle(v);
                  }}
                />
              </Badge>
            ))}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command>
            <CommandInput placeholder={placeholder} />
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandList>
              {options.map((option) => (
                <CommandItem key={option} value={option} onSelect={() => toggle(option)}>
                  <Check className={value.includes(option) ? 'h-4 w-4 opacity-100' : 'h-4 w-4 opacity-0'} />
                  {option}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function AdvancedFilter({ filters, handleFilterChange, allPokemon, allBonuses }: AdvancedFilterProps) {
  return (
    <div className="flex flex-col gap-4">
      <MultiSelect
        label="Filter by Pokémon"
        placeholder="Select Pokémon"
        options={allPokemon}
        value={filters.pokemonSearch}
        onChange={(value) => handleFilterChange('pokemonSearch', value)}
      />
      <MultiSelect
        label="Filter by Bonus"
        placeholder="Select Bonuses"
        options={allBonuses}
        value={filters.bonusSearch}
        onChange={(value) => handleFilterChange('bonusSearch', value)}
      />
    </div>
  );
}

export default AdvancedFilter;
