import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Card,
  CardContent,
  Skeleton,
  Alert,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Avatar,
  Stack,
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { fetchResearchTasks } from '../services/dataService';
import type { ResearchTaskData, ResearchTask, TaskReward } from '../types/researchTasks';

function ResearchTasksPage() {
  const [data, setData] = useState<ResearchTaskData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const taskData = await fetchResearchTasks();
        setData(taskData);
      } catch (err) {
        setError('Failed to load research task data. Please try again later.');
        console.error('Error loading research tasks:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ py: 4 }}>
        <Skeleton variant="text" width={250} height={60} sx={{ mb: 3 }} />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} variant="rectangular" height={80} sx={{ mb: 2, borderRadius: 2 }} />
        ))}
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 4,
          textAlign: 'center',
          backgroundColor: 'background.paper',
          borderRadius: 2,
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
        <Typography variant="h5" color="text.primary" gutterBottom>
          Failed to Load Research Task Data
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {error || 'An unexpected error occurred'}
        </Typography>
      </Paper>
    );
  }

  const renderReward = (reward: TaskReward, index: number) => (
    <Card
      key={index}
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 2,
        backgroundColor: 'background.default',
        minHeight: 80,
      }}
    >
      <Avatar
        src={reward.asset_url}
        alt={reward.name}
        variant="square"
        sx={{
          width: 56,
          height: 56,
          mr: 2,
        }}
      />
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2" fontWeight={600}>
          {reward.name}
          {reward.quantity && reward.quantity > 1 && ` x${reward.quantity}`}
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
          <Chip
            label={reward.type === 'encounter' ? 'Pokémon' : 'Item'}
            size="small"
            sx={{
              height: 20,
              fontSize: '0.7rem',
              backgroundColor: reward.type === 'encounter' ? '#4CAF50' : '#2196F3',
              color: '#fff',
              fontWeight: 600,
            }}
          />
          {reward.shiny_available && (
            <Chip
              label="✨ Shiny"
              size="small"
              sx={{
                height: 20,
                fontSize: '0.7rem',
                backgroundColor: '#FFD700',
                color: '#000',
                fontWeight: 600,
              }}
            />
          )}
        </Box>
      </Box>
    </Card>
  );

  const renderTask = (task: ResearchTask, index: number) => (
    <Accordion
      key={index}
      sx={{
        mb: 1,
        '&:before': { display: 'none' },
        borderRadius: '12px !important',
        overflow: 'hidden',
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          backgroundColor: 'background.paper',
          '&:hover': {
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', width: '100%', pr: 2 }}>
          <Typography variant="body1" fontWeight={600} sx={{ flexGrow: 1 }}>
            {task.task}
          </Typography>
          <Chip
            label={`${task.rewards.length} Reward${task.rewards.length !== 1 ? 's' : ''}`}
            size="small"
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: '#fff',
              fontWeight: 600,
            }}
          />
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ pt: 2 }}>
        <Grid container spacing={2}>
          {task.rewards.map((reward, idx) => (
            <Grid key={idx} item xs={12} sm={6} md={4}>
              {renderReward(reward, idx)}
            </Grid>
          ))}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );

  return (
    <Box sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight={700} gutterBottom>
          Research Tasks
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Current field research tasks and their rewards
        </Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        Field research tasks are obtained by spinning PokéStops. Complete tasks to earn rewards
        including Pokémon encounters, items, and Stardust.
      </Alert>

      <Stack spacing={3}>
        {Object.entries(data).map(([category, tasks]) => {
          if (!tasks || tasks.length === 0) return null;

          return (
            <Box key={category}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography variant="h5" fontWeight={600}>
                  {category}
                </Typography>
                <Chip
                  label={`${tasks.length} Task${tasks.length !== 1 ? 's' : ''}`}
                  size="small"
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: '#fff',
                    fontWeight: 600,
                  }}
                />
              </Box>
              {tasks.map((task, index) => renderTask(task, index))}
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}

export default ResearchTasksPage;
