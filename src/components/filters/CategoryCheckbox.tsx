import { Checkbox, FormControlLabel } from "@mui/material";
import React from "react";
import { ColorKeyLabel } from "./ColorKeyLabel";

interface CategoryCheckboxProps {
  category: string;
  isChecked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CategoryCheckbox = React.memo(
  /**
   * Renders a checkbox for selecting a category.
   *
   * @param param0 Props for the CategoryCheckbox component.
   * @returns A checkbox for selecting a category.
   */
  function CategoryCheckbox({ category, isChecked, onChange }: CategoryCheckboxProps) {
    return (
      <FormControlLabel
        key={category}
        control={<Checkbox checked={isChecked} onChange={onChange} name={category} />}
        label={<ColorKeyLabel category={category} />}
      />
    );
  }
);
