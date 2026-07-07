import { Box, Typography } from '@mui/material';

interface PageHeaderProps {
  title: string;
  description: string;
}

/**
 * Reusable page header component with consistent styling
 */
export const PageHeader = ({ title, description }: PageHeaderProps) => (
  <Box sx={{ mb: { xs: 3, md: 4 } }}>
    <Typography
      variant="h3"
      fontWeight={700}
      gutterBottom
      sx={{ fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' } }}
    >
      {title}
    </Typography>
    <Typography variant="body1" color="text.secondary">
      {description}
    </Typography>
  </Box>
);
