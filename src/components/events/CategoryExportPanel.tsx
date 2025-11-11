import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Stack,
} from '@mui/material';
import React, { useCallback } from 'react';
import { ColorKeyLabel } from '../filters/ColorKeyLabel';

interface CategoryExportPanelProps {
  allCategories: string[];
  selectedCategories: string[];
  onSelectionChange: (newSelection: string[]) => void;
}

export const CategoryExportPanel = React.memo(function CategoryExportPanel({
  allCategories,
  selectedCategories,
  onSelectionChange,
}: CategoryExportPanelProps) {
  const handleToggleCategory = useCallback(
    (category: string) => {
      const newSelection = selectedCategories.includes(category)
        ? selectedCategories.filter((c) => c !== category)
        : [...selectedCategories, category];
      onSelectionChange(newSelection);
    },
    [selectedCategories, onSelectionChange]
  );

  return (
    <Box sx={{ pt: 2 }}>
      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1 }}>
        <Button onClick={() => onSelectionChange(allCategories)}>
          Select All
        </Button>
        <Button onClick={() => onSelectionChange([])}>Clear All</Button>
      </Stack>
      <Divider />
      <FormGroup sx={{ mt: 2, maxHeight: '40vh', overflowY: 'auto' }}>
        {allCategories.map((category) => (
          <FormControlLabel
            key={category}
            control={
              <Checkbox
                checked={selectedCategories.includes(category)}
                onChange={() => handleToggleCategory(category)}
              />
            }
            label={<ColorKeyLabel category={category} />}
          />
        ))}
      </FormGroup>
    </Box>
  );
});
