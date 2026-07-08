import React, { useEffect, useMemo } from 'react';
import { ShinyChip } from '../components/filters/shared';
import { DataErrorDisplay } from '../components/shared/DataErrorDisplay';
import { DataLoadingSkeleton } from '../components/shared/DataLoadingSkeleton';
import { PageHeader } from '../components/shared/PageHeader';
import { SectionHeader } from '../components/shared/SectionHeader';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { Alert } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';
import { Card } from '../components/ui/card';
import { usePageData } from '../hooks/usePageData';
import { fetchResearchTasks } from '../services/dataService';
import type { ResearchTaskFilters } from '../types/pageFilters';
import type { ResearchTask, ResearchTaskData, TaskReward } from '../types/researchTasks';

interface ResearchTasksPageProps {
  filters: ResearchTaskFilters;
  onSetFilterOptions: (options: { categories: string[] }) => void;
}

function ResearchTasksPage({ filters, onSetFilterOptions }: ResearchTasksPageProps) {
  const { data, loading, error, refetch } = usePageData<ResearchTaskData>(
    fetchResearchTasks,
    'Failed to load research task data. Please try again later.'
  );

  useEffect(() => {
    if (data) {
      const categories = Object.keys(data);
      onSetFilterOptions({ categories });
    }
  }, [data, onSetFilterOptions]);

  const filteredData = useMemo(() => {
    if (!data) return null;

    const result: ResearchTaskData = {};

    Object.entries(data).forEach(([category, tasks]) => {
      if (filters.selectedCategories.length > 0 && !filters.selectedCategories.includes(category)) {
        return;
      }

      const filteredTasks = tasks.filter((task) => {
        if (filters.taskSearch && !task.task.toLowerCase().includes(filters.taskSearch.toLowerCase())) {
          return false;
        }

        const hasMatchingReward = task.rewards.some((reward) => {
          if (filters.rewardTypes.length > 0 && !filters.rewardTypes.includes(reward.type)) {
            return false;
          }
          if (
            filters.pokemonSearch &&
            reward.type === 'encounter' &&
            !reward.name.toLowerCase().includes(filters.pokemonSearch.toLowerCase())
          ) {
            return false;
          }
          if (filters.shinyOnly && !reward.shiny_available) {
            return false;
          }
          return true;
        });

        if (filters.rewardTypes.length > 0 || filters.pokemonSearch || filters.shinyOnly) {
          return hasMatchingReward;
        }

        return true;
      });

      if (filteredTasks.length > 0) {
        result[category] = filteredTasks;
      }
    });

    return result;
  }, [data, filters]);

  if (loading) {
    return <DataLoadingSkeleton itemCount={6} gridSize={{ xs: 12 }} />;
  }

  if (error || !data || !filteredData) {
    return (
      <DataErrorDisplay title="Failed to Load Research Task Data" message={error || undefined} onRetry={refetch} />
    );
  }

  const renderReward = (reward: TaskReward, index: number) => (
    <Card key={index} className="flex min-h-20 items-center bg-muted p-4">
      <div className="mr-3 flex h-16 w-16 min-w-16 items-center justify-center overflow-hidden rounded-md bg-card">
        <img src={reward.asset_url} alt={reward.name} className="max-h-full max-w-full object-contain" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">
          {reward.name}
          {reward.quantity && reward.quantity > 1 && ` x${reward.quantity}`}
        </p>
        <div className="mt-1 flex flex-wrap gap-1">
          <Badge
            size="sm"
            style={{ backgroundColor: reward.type === 'encounter' ? '#4CAF50' : '#2196F3', color: '#fff' }}
          >
            {reward.type === 'encounter' ? 'Pokémon' : 'Item'}
          </Badge>
          {reward.shiny_available && <ShinyChip />}
        </div>
      </div>
    </Card>
  );

  const renderTask = (task: ResearchTask, index: number) => (
    <AccordionItem
      key={index}
      value={String(index)}
      className="mb-2 overflow-hidden rounded-lg border border-border px-0 shadow-soft-xs transition-shadow hover:shadow-soft-sm last:border-b"
    >
      <AccordionTrigger className="px-4 hover:no-underline">
        <div className="flex w-full flex-wrap items-center gap-2 pr-2">
          <span className="flex-1 text-left text-sm font-semibold">{task.task}</span>
          <Badge>
            {task.rewards.length} Reward{task.rewards.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pt-2">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
          {task.rewards.map((reward, idx) => renderReward(reward, idx))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );

  return (
    <div className="py-4">
      <PageHeader title="Research Tasks" description="Current field research tasks and their rewards" />

      <Alert variant="info" className="mb-6">
        Field research tasks are obtained by spinning PokéStops. Complete tasks to earn rewards including
        Pokémon encounters, items, and Stardust.
      </Alert>

      <div className="flex flex-col gap-6">
        {Object.entries(filteredData).map(([category, tasks]) => {
          if (!tasks || tasks.length === 0) return null;

          return (
            <div key={category}>
              <SectionHeader
                title={category}
                count={tasks.length}
                label={`Task${tasks.length !== 1 ? 's' : ''}`}
              />
              <Accordion type="multiple">{tasks.map((task, index) => renderTask(task, index))}</Accordion>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default React.memo(ResearchTasksPage);
