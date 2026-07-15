import { Badge } from '../../ui/badge';
import { ShinyIndicator } from '../../shared/ShinyIndicator';

/**
 * Reusable shiny indicator chip with consistent styling
 */
export const ShinyChip = () => (
  <Badge variant="muted" size="sm" className="gap-1">
    <ShinyIndicator />
    Shiny
  </Badge>
);
