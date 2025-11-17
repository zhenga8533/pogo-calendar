import { Chip, useTheme } from '@mui/material';
import React, { useMemo } from 'react';
import { getColorForCategory } from '../../utils/colorUtils';

interface CategoryTagProps {
  category: string;
}

function CategoryTagComponent({ category }: CategoryTagProps) {
  const theme = useTheme();

  const categoryColor = useMemo(
    () => getColorForCategory(category, theme.palette.mode),
    [category, theme.palette.mode]
  );

  return (
    <Chip
      label={category}
      size="small"
      sx={{
        backgroundColor: categoryColor,
        color: theme.palette.getContrastText(categoryColor),
        fontWeight: 'bold',
      }}
    />
  );
}

export const CategoryTag = React.memo(CategoryTagComponent);
CategoryTag.displayName = 'CategoryTag';
