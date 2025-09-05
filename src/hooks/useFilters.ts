import { useEffect, useState } from "react";

export const initialFilters = {
  searchTerm: "",
  selectedCategories: [] as string[],
  startDate: null as Date | null,
  endDate: null as Date | null,
  timeRange: [0, 24],
  showOnlySaved: false,
};

export function useFilters() {
  const [filters, setFilters] = useState(() => {
    const savedFilters = localStorage.getItem("eventFilters");
    if (savedFilters) {
      const parsedFilters = JSON.parse(savedFilters);
      if (parsedFilters.startDate) {
        parsedFilters.startDate = new Date(parsedFilters.startDate);
      }
      if (parsedFilters.endDate) {
        parsedFilters.endDate = new Date(parsedFilters.endDate);
      }
      return parsedFilters;
    }
    return initialFilters;
  });

  useEffect(() => {
    localStorage.setItem("eventFilters", JSON.stringify(filters));
  }, [filters]);

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  return { filters, setFilters, handleResetFilters };
}
