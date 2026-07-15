import { Badge } from '../../ui/badge';
import { ShinyIndicator } from '../../shared/ShinyIndicator';

/**
 * Reusable shiny indicator chip with consistent styling
 */
export const ShinyChip = () => (
  <Badge
    variant="muted"
    size="sm"
    className="gap-1 bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
  >
    <ShinyIndicator />
    Shiny
  </Badge>
);
