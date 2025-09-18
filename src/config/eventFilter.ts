export const SAVED_EVENTS_CATEGORY = "Saved";

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

/**
 * Formats an hour value (0-24) to a 12-hour time string with AM/PM.
 */
export function formatTime(value: number): string {
  if (value === 24) return "12 AM";
  const ampm = value < 12 ? "AM" : "PM";
  const hour = value % 12 === 0 ? 12 : value % 12;
  return `${hour} ${ampm}`;
}
