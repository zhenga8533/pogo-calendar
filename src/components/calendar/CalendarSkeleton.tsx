import { Box, Divider, Grid, Paper, Skeleton, Stack } from "@mui/material";

interface CalendarSkeletonProps {
  isMobile: boolean;
}

/**
 * CalendarSkeleton component to display a loading state for the calendar.
 *
 * @param param0 Props containing isMobile flag.
 * @returns The rendered CalendarSkeleton component.
 */
export function CalendarSkeleton({ isMobile }: CalendarSkeletonProps) {
  // Render a simplified skeleton for mobile view
  if (isMobile) {
    return (
      <Stack spacing={2}>
        <Skeleton variant="rounded" height={56} />
        <Skeleton variant="rounded" height="75vh" />
      </Stack>
    );
  }

  // Render a detailed skeleton for desktop view
  return (
    <Box>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2}>
            <Skeleton variant="rounded" sx={{ flexGrow: 3 }} height={56} />
            <Skeleton variant="rounded" sx={{ flexGrow: 1 }} height={56} />
          </Stack>
          <Stack direction="row" spacing={2}>
            <Skeleton variant="rounded" width="100%" height={56} />
            <Skeleton variant="rounded" width="100%" height={56} />
          </Stack>
          <Box sx={{ px: 1 }}>
            <Skeleton variant="text" height={24} width="15%" sx={{ mb: 2 }} />
            <Skeleton variant="rounded" height={24} />
          </Box>
          <Divider />
          <Stack direction="row" spacing={2} justifyContent="space-between">
            <Skeleton variant="rounded" width={150} height={36} />
            <Stack direction="row" spacing={2}>
              <Skeleton variant="rounded" width={120} height={36} />
              <Skeleton variant="rounded" width={100} height={36} />
              <Skeleton variant="rounded" width={100} height={36} />
            </Stack>
          </Stack>
        </Stack>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Grid container spacing={1}>
          <Grid sx={{ width: "100%" }}>
            <Skeleton variant="rounded" height={50} sx={{ mb: 1 }} />
          </Grid>
          {[...Array(5)].map((_, rowIndex) => (
            <Grid key={rowIndex} container spacing={1} sx={{ width: "100%", mb: 1 }}>
              {[...Array(7)].map((_, colIndex) => (
                <Grid key={colIndex} sx={{ flex: 1 }}>
                  <Skeleton variant="rounded" height={100} />
                </Grid>
              ))}
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
}
