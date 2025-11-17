import { Box, Container, Grid, Paper, Skeleton } from '@mui/material';

interface DataLoadingSkeletonProps {
  itemCount?: number;
  gridSize?: { xs: number; sm?: number; md?: number; lg?: number };
}

export const DataLoadingSkeleton = ({
  itemCount = 6,
  gridSize = { xs: 12, sm: 6, md: 4 },
}: DataLoadingSkeletonProps) => {
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {Array.from({ length: itemCount }).map((_, index) => (
          <Grid key={index} size={gridSize}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                backgroundColor: 'background.paper',
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Skeleton
                  variant="rectangular"
                  width={60}
                  height={60}
                  sx={{ mr: 2, borderRadius: 1 }}
                />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="60%" height={28} />
                  <Skeleton variant="text" width="40%" height={20} />
                </Box>
              </Box>
              <Skeleton variant="text" width="100%" height={20} />
              <Skeleton variant="text" width="80%" height={20} />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
