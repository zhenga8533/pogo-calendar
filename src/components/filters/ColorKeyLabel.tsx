import React, { useMemo } from 'react';
import { useSettingsContext } from '../../hooks/useSettingsContext';
import { useResolvedThemeMode } from '../../hooks/useThemeMode';
import { getColorForCategory } from '../../utils/colorUtils';

interface ColorKeyLabelProps {
  category: string;
  showText?: boolean;
}

/**
 * Renders a label with a colored dot representing the category.
 */
function ColorKeyLabelComponent({ category, showText = true }: ColorKeyLabelProps) {
  const { settings } = useSettingsContext();
  const mode = useResolvedThemeMode(settings.theme);

  const backgroundColor = useMemo(() => getColorForCategory(category, mode), [category, mode]);

  return (
    <span className="flex items-center gap-2.5">
      <span
        className="inline-block h-3.5 w-3.5 shrink-0 rounded-full border border-border"
        style={{ backgroundColor }}
      />
      {showText && <span className="text-sm">{category}</span>}
    </span>
  );
}

export const ColorKeyLabel = React.memo(ColorKeyLabelComponent);
ColorKeyLabel.displayName = 'ColorKeyLabel';
