import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Card,
  Chip,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import React from 'react';
import { DataErrorDisplay } from '../components/shared/DataErrorDisplay';
import { DataLoadingSkeleton } from '../components/shared/DataLoadingSkeleton';
import { SHINY_COLOR } from '../config/colorMapping';
import { usePageData } from '../hooks/usePageData';
import { fetchResearchTasks } from '../services/dataService';
import type {
  ResearchTask,
  ResearchTaskData,
  TaskReward,
} from '../types/researchTasks';

function ResearchTasksPage() {
  const { data, loading, error, refetch } = usePageData<ResearchTaskData>(
    fetchResearchTasks,
    'Failed to load research task data. Please try again later.'
  );

  if (loading) {
    return <DataLoadingSkeleton itemCount={6} gridSize={{ xs: 12 }} />;
  }

  if (error || !data) {
    return (
      <DataErrorDisplay
        title="Failed to Load Research Task Data"
        message={error || undefined}
        onRetry={refetch}
      />
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
      <Box
        sx={{
          width: 64,
          height: 64,
          minWidth: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mr: 2,
          backgroundColor: 'background.paper',
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src={reward.asset_url}
          alt={reward.name}
          sx={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
          }}
        />
      </Box>
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Typography variant="subtitle2" fontWeight={600} noWrap>
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
              backgroundColor:
                reward.type === 'encounter' ? '#4CAF50' : '#2196F3',
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
                backgroundColor: SHINY_COLOR,
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
            backgroundColor: 'action.hover',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            flexWrap: 'wrap',
            width: '100%',
            pr: 2,
          }}
        >
          <Typography variant="body1" fontWeight={600} sx={{ flexGrow: 1 }}>
            {task.task}
          </Typography>
          <Chip
            label={`${task.rewards.length} Reward${
              task.rewards.length !== 1 ? 's' : ''
            }`}
            size="small"
            sx={{
              backgroundColor: 'primary.main',
              color: '#fff',
              fontWeight: 600,
            }}
          />
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ pt: 2 }}>
        <Grid container spacing={2}>
          {task.rewards.map((reward, idx) => (
            <Grid key={idx} size={{ xs: 12, sm: 6, md: 4 }}>
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
        Field research tasks are obtained by spinning PokéStops. Complete tasks
        to earn rewards including Pokémon encounters, items, and Stardust.
      </Alert>

      <Stack spacing={3}>
        {Object.entries(data).map(([category, tasks]) => {
          if (!tasks || tasks.length === 0) return null;

          return (
            <Box key={category}>
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}
              >
                <Typography variant="h5" fontWeight={600}>
                  {category}
                </Typography>
                <Chip
                  label={`${tasks.length} Task${tasks.length !== 1 ? 's' : ''}`}
                  size="small"
                  sx={{
                    backgroundColor: 'primary.main',
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

export default React.memo(ResearchTasksPage);
