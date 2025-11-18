import { Chip } from '@mui/material';
import { SHINY_COLOR } from '../../../config/colorMapping';

/**
 * Reusable shiny indicator chip with consistent styling
 */
export const ShinyChip = () => (
  <Chip
    label="✨ Shiny"
    size="small"
    sx={{
      height: 20,
      fontSize: '0.7rem',
      backgroundColor: SHINY_COLOR,
      color: '#000',
      fontWeight: 600,
    }}
  />
);
