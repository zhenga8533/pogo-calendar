import { Card, CardContent, Stack } from '@mui/material';

interface BaseFilterCardProps {
  children: React.ReactNode;
}

/**
 * Reusable card wrapper for filter components with consistent styling
 */
export const BaseFilterCard = ({ children }: BaseFilterCardProps) => (
  <Card
    elevation={3}
    sx={{
      backgroundColor: 'background.paper',
      borderRadius: 2,
      height: 'fit-content',
    }}
  >
    <CardContent>
      <Stack spacing={3}>{children}</Stack>
    </CardContent>
  </Card>
);
