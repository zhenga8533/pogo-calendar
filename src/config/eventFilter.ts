export const initialFilters = {
  searchTerm: "",
  selectedCategories: [] as string[],
  startDate: null as Date | null,
  endDate: null as Date | null,
  timeRange: [0, 24],
  showActiveOnly: false,
  pokemonSearch: [] as string[],
  bonusSearch: [] as string[],
};

export const marks = [
  { value: 0, label: "12 AM" },
  { value: 6, label: "6 AM" },
  { value: 12, label: "12 PM" },
  { value: 18, label: "6 PM" },
  { value: 24, label: "12 AM" },
];

export const dayOptions = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

export const categoryGroups = {
  "Major Events": ["Community Day", "Pokémon GO Fest", "Pokémon GO Tour", "Raid Day", "Raid Weekend", "Wild Area"],
  "Weekly Events": ["Raid Hour", "Pokémon Spotlight Hour", "Max Mondays"],
};
