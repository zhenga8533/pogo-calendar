import React, { useMemo } from 'react';
import { useSettingsContext } from '../../contexts/SettingsContext';
import { useResolvedThemeMode } from '../../hooks/useThemeMode';
import { contrastColor, getColorForCategory } from '../../utils/colorUtils';
import { Badge } from '../ui/badge';

interface CategoryTagProps {
  category: string;
}

function CategoryTagComponent({ category }: CategoryTagProps) {
  const { settings } = useSettingsContext();
  const mode = useResolvedThemeMode(settings.theme);

  const categoryColor = useMemo(() => getColorForCategory(category, mode), [category, mode]);

  return (
    <Badge
      style={{
        backgroundColor: categoryColor,
        color: contrastColor(categoryColor),
        borderColor: 'transparent',
      }}
    >
      {category}
    </Badge>
  );
}

export const CategoryTag = React.memo(CategoryTagComponent);
CategoryTag.displayName = 'CategoryTag';
