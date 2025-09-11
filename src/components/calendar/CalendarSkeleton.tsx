import { Box, Divider, Paper, Skeleton, Stack } from "@mui/material";
import React from "react";

interface CalendarSkeletonProps {
  isMobile: boolean;
}

/**
 * Renders the skeleton header section for the desktop calendar view.
 *
 * @returns A skeleton header for the desktop calendar view.
 */
const DesktopSkeletonHeader = () => (
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
);

/**
 * Renders the skeleton for the main 7-column calendar grid.
 */
const DesktopSkeletonGrid = () => {
  const SKELETON_ROWS = 5;
  const SKELETON_COLS = 7;

  return (
    <Paper sx={{ p: 2 }}>
      {/* Calendar Header */}
      <Skeleton variant="rounded" height={50} sx={{ mb: 1 }} />

      {/* Calendar Day Cells Container */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `repeat(${SKELETON_COLS}, 1fr)`,
          gap: 1,
        }}
      >
        {[...Array(SKELETON_ROWS * SKELETON_COLS)].map((_, index) => (
          <Skeleton key={index} variant="rounded" height={100} />
        ))}
      </Box>
    </Paper>
  );
};

/**
 * CalendarSkeletonComponent renders a skeleton UI for the calendar.
 *
 * @param param0 An object containing the isMobile prop.
 * @returns A skeleton UI for the calendar based on the device type.
 */
function CalendarSkeletonComponent({ isMobile }: CalendarSkeletonProps) {
  // Render a simplified skeleton for mobile view
  if (isMobile) {
    return (
      <Stack spacing={2}>
        <Skeleton variant="rounded" height={56} />
        <Skeleton variant="rounded" height="75vh" />
      </Stack>
    );
  }

  // Render a detailed, componentized skeleton for the desktop view
  return (
    <Box>
      <DesktopSkeletonHeader />
      <DesktopSkeletonGrid />
    </Box>
  );
}

export const CalendarSkeleton = React.memo(CalendarSkeletonComponent);
