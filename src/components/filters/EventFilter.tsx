import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import React, { useCallback, useState } from "react";
import { SAVED_EVENTS_CATEGORY } from "../../config/constants";
import type { EventFilterProps, Filters } from "../../types/filters";
import { DesktopEventFilter } from "./DesktopEventFilter";
import { MobileEventFilter } from "./MobileEventFilter";

/**
 * Responsive EventFilter component that switches between desktop and mobile views.
 *
 * @param props Props for the EventFilter component.
 * @returns A responsive event filter component that adapts to desktop and mobile views.
 */
function EventFilter(props: EventFilterProps) {
  const { filters, onFilterChange, allCategories, isMobile } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Handler to open the category menu.
  const handleMenuClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  // Handler to close the category menu.
  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  // Handler to update a specific filter field.
  const handleFilterChange = useCallback(
    (field: keyof Filters, value: any) => {
      onFilterChange({ ...filters, [field]: value });
    },
    [filters, onFilterChange]
  );

  // Handler specifically for toggling a category's selection.
  const handleCategoryChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name: category, checked } = event.target;
      const { selectedCategories } = filters;

      const newSelectedCategories = checked
        ? [...selectedCategories, category]
        : selectedCategories.filter((c) => c !== category);

      handleFilterChange("selectedCategories", newSelectedCategories);
    },
    [filters, handleFilterChange]
  );

  // Handler to select all available categories.
  const handleSelectAll = useCallback(() => {
    const all = [SAVED_EVENTS_CATEGORY, ...allCategories];
    handleFilterChange("selectedCategories", all);
  }, [allCategories, handleFilterChange]);

  // Handler to clear all selected categories.
  const handleClearAll = useCallback(() => {
    handleFilterChange("selectedCategories", []);
  }, [handleFilterChange]);

  const sharedProps = {
    ...props,
    anchorEl,
    handleMenuClick,
    handleMenuClose,
    handleFilterChange,
    handleCategoryChange,
    handleSelectAll,
    handleClearAll,
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {isMobile ? <MobileEventFilter {...sharedProps} /> : <DesktopEventFilter {...sharedProps} />}
    </LocalizationProvider>
  );
}

export default EventFilter;
