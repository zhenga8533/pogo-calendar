import React, { useCallback } from 'react';
import { ColorKeyLabel } from '../filters/ColorKeyLabel';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Separator } from '../ui/separator';

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
    <div className="pt-3">
      <div className="mb-2 flex justify-end gap-1">
        <Button size="sm" variant="ghost" onClick={() => onSelectionChange(allCategories)}>
          Select All
        </Button>
        <Button size="sm" variant="ghost" onClick={() => onSelectionChange([])}>
          Clear All
        </Button>
      </div>
      <Separator />
      <div className="mt-3 flex max-h-[40vh] flex-col gap-2.5 overflow-y-auto">
        {allCategories.map((category) => (
          <label key={category} className="flex items-center gap-2.5 text-sm">
            <Checkbox
              checked={selectedCategories.includes(category)}
              onCheckedChange={() => handleToggleCategory(category)}
            />
            <ColorKeyLabel category={category} />
          </label>
        ))}
      </div>
    </div>
  );
});
