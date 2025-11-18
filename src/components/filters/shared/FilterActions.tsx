import ReplayIcon from '@mui/icons-material/Replay';
import { Button, Divider, Stack } from '@mui/material';

interface FilterActionsProps {
  onReset: () => void;
}

/**
 * Reusable filter actions component with reset button
 */
export const FilterActions = ({ onReset }: FilterActionsProps) => (
  <>
    <Divider />
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={2}
      sx={{
        justifyContent: { xs: 'flex-start', md: 'flex-end' },
        flexWrap: 'wrap',
        mt: 3,
      }}
    >
      <Button variant="outlined" startIcon={<ReplayIcon />} onClick={onReset}>
        Reset
      </Button>
    </Stack>
  </>
);
