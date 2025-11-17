import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Box, Button, Paper, Typography } from '@mui/material';

interface DataErrorDisplayProps {
  title: string;
  message?: string;
  onRetry?: () => void;
}

export const DataErrorDisplay = ({
  title,
  message,
  onRetry,
}: DataErrorDisplayProps) => {
  const defaultMessage =
    message || 'An unexpected error occurred. Please try again later.';

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 4,
          textAlign: 'center',
          backgroundColor: 'background.paper',
          borderRadius: 2,
          maxWidth: 400,
        }}
      >
        <ErrorOutlineIcon
          sx={{
            fontSize: 64,
            color: 'error.main',
            mb: 2,
          }}
        />
        <Typography variant="h5" color="text.primary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {defaultMessage}
        </Typography>
        {onRetry && (
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={onRetry}
            sx={{ mt: 1 }}
          >
            Retry
          </Button>
        )}
      </Paper>
    </Box>
  );
};
