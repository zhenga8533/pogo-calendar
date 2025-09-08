import { Box, Typography, useTheme } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import React, { useState } from "react";
import { getColorForCategory } from "../../utils/colorUtils";
import { DesktopEventFilter } from "./DesktopEventFilter";
import { MobileEventFilter } from "./MobileEventFilter";

export interface Filters {
  searchTerm: string;
  selectedCategories: string[];
  startDate: Date | null;
  endDate: Date | null;
  timeRange: number[];
}

export interface EventFilterProps {
  filters: Filters;
  onFilterChange: (newFilters: Filters) => void;
  onResetFilters: () => void;
  onNewEventClick: () => void;
  allCategories: string[];
  isMobile: boolean;
}

export const marks = [
  { value: 0, label: "12 AM" },
  { value: 6, label: "6 AM" },
  { value: 12, label: "12 PM" },
  { value: 18, label: "6 PM" },
  { value: 24, label: "12 AM" },
];

export const categoryGroups = {
  "Major Events": ["Community Day", "Pokémon GO Fest", "Pokémon GO Tour", "Raid Day", "Raid Weekend", "Wild Area"],
  "Weekly Events": ["Raid Hour", "Pokémon Spotlight Hour", "Max Mondays"],
};

/**
 * Format hour value to 12-hour time with AM/PM
 *
 * @param value The hour value (0-24)
 * @returns Formatted time string (e.g., "12 AM", "1 PM")
 */
export function formatTime(value: number) {
  if (value === 24) return "12 AM";
  const ampm = value < 12 ? "AM" : "PM";
  const hour = value % 12 === 0 ? 12 : value % 12;
  return `${hour} ${ampm}`;
}

/**
 * ColorKeyLabel component to display a colored circle and category name.
 *
 * @param param0 Props containing category name.
 * @returns The rendered ColorKeyLabel component.
 */
export function ColorKeyLabel({ category }: { category: string }) {
  const theme = useTheme();
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box
        component="span"
        sx={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          mr: 1.5,
          backgroundColor: getColorForCategory(category, theme.palette.mode),
          border: `1px solid ${theme.palette.divider}`,
        }}
      />
      <Typography variant="body2">{category}</Typography>
    </Box>
  );
}

/**
 * EventFilter component to filter events by search term, date range, time range, and categories.
 *
 * @param param0 Props containing filters, change handlers, categories, and mobile view flag.
 * @returns The rendered EventFilter component.
 */
function EventFilter(props: EventFilterProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Handlers for menu open/close
  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handler for filter changes
  const handleFilterChange = (field: keyof Filters, value: any) => {
    props.onFilterChange({ ...props.filters, [field]: value });
  };

  // Handler for category checkbox changes
  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const category = event.target.name;
    const isChecked = event.target.checked;
    const newSelectedCategories = isChecked
      ? [...props.filters.selectedCategories, category]
      : props.filters.selectedCategories.filter((c) => c !== category);
    handleFilterChange("selectedCategories", newSelectedCategories);
  };

  // Handlers for select all and clear all categories
  const handleSelectAll = () => {
    const all = ["Saved", ...props.allCategories];
    handleFilterChange("selectedCategories", all);
  };

  // Clear all selected categories
  const handleClearAll = () => {
    handleFilterChange("selectedCategories", []);
  };

  const sharedProps = {
    ...props,
    handleFilterChange,
    handleCategoryChange,
    handleSelectAll,
    handleClearAll,
    anchorEl,
    handleMenuClick,
    handleMenuClose,
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {props.isMobile ? <MobileEventFilter {...sharedProps} /> : <DesktopEventFilter {...sharedProps} />}
    </LocalizationProvider>
  );
}

export default EventFilter;
