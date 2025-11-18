import { Box, Stack, Typography } from '@mui/material';

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
}

/**
 * Reusable section wrapper for filter groups
 */
export const FilterSection = ({ title, children }: FilterSectionProps) => (
  <Box sx={{ mb: 3 }}>
    <Typography variant="h6" component="h3" fontWeight="bold" gutterBottom>
      {title}
    </Typography>
    <Stack spacing={2} sx={{ mt: 1 }}>
      {children}
    </Stack>
  </Box>
);
