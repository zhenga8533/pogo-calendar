import { Box, Typography } from '@mui/material';

interface PageHeaderProps {
  title: string;
  description: string;
}

/**
 * Reusable page header component with consistent styling
 */
export const PageHeader = ({ title, description }: PageHeaderProps) => (
  <Box sx={{ mb: 4 }}>
    <Typography variant="h3" fontWeight={700} gutterBottom>
      {title}
    </Typography>
    <Typography variant="body1" color="text.secondary">
      {description}
    </Typography>
  </Box>
);
