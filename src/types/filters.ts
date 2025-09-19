export interface EventFilterProps {
  filters: Filters;
  onFilterChange: (newFilters: Filters) => void;
  onResetFilters: () => void;
  onNewEventClick: () => void;
  onOpenExportDialog: () => void;
  allCategories: string[];
  allPokemon: string[];
  allBonuses: string[];
}

export interface Filters {
  searchTerm: string;
  selectedCategories: string[];
  startDate: Date | null;
  endDate: Date | null;
  timeRange: number[];
  showActiveOnly: boolean;
  pokemonSearch: string[];
  bonusSearch: string[];
}
