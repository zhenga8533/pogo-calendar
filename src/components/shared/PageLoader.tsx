import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { memo } from 'react';

interface PageLoaderProps {
  message?: string;
}

/**
 * PageLoader component displays a centered loading spinner with an optional message.
 * Used as a Suspense fallback for lazy-loaded routes.
 */
function PageLoaderComponent({ message = 'Loading...' }: PageLoaderProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        p: 3,
      }}
    >
      <Stack spacing={2} alignItems="center">
        <CircularProgress size={48} thickness={4} />
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ fontWeight: 500 }}
        >
          {message}
        </Typography>
      </Stack>
    </Box>
  );
}

export const PageLoader = memo(PageLoaderComponent);
PageLoader.displayName = 'PageLoader';
