import { LayoutGrid, List } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { ShinyChip } from '../components/filters/shared';
import { DataErrorDisplay } from '../components/shared/DataErrorDisplay';
import { DataLoadingSkeleton } from '../components/shared/DataLoadingSkeleton';
import { PageHeader } from '../components/shared/PageHeader';
import { Alert } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';
import { Card } from '../components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '../components/ui/toggle-group';
import { POKEMON_TYPE_COLORS, RAID_TIER_COLORS } from '../config/colorMapping';
import { MOBILE_QUERY, useMediaQuery } from '../hooks/useMediaQuery';
import { usePageData } from '../hooks/usePageData';
import { fetchRaidBosses } from '../services/dataService';
import type { RaidBossFilters } from '../types/pageFilters';
import type { RaidBoss, RaidBossData } from '../types/raidBosses';

interface RaidBossesPageProps {
  filters: RaidBossFilters;
  onSetFilterOptions: (options: { raidTiers: string[]; types: string[] }) => void;
}

function RaidBossesPage({ filters, onSetFilterOptions }: RaidBossesPageProps) {
  const { data, loading, error, refetch } = usePageData<RaidBossData>(
    fetchRaidBosses,
    'Failed to load raid boss data. Please try again later.'
  );
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    if (data) {
      const raidTiers = Object.keys(data);
      const typesSet = new Set<string>();
      Object.values(data).forEach((bosses) => {
        bosses.forEach((boss) => {
          boss.types.forEach((type) => typesSet.add(type));
        });
      });
      const types = Array.from(typesSet).sort();
      onSetFilterOptions({ raidTiers, types });
    }
  }, [data, onSetFilterOptions]);

  const filteredData = useMemo(() => {
    if (!data) return null;

    const result: RaidBossData = {};

    Object.entries(data).forEach(([tier, bosses]) => {
      if (filters.selectedRaidTiers.length > 0 && !filters.selectedRaidTiers.includes(tier)) {
        return;
      }

      const filteredBosses = bosses.filter((boss) => {
        if (filters.pokemonSearch && !boss.name.toLowerCase().includes(filters.pokemonSearch.toLowerCase())) {
          return false;
        }
        if (filters.shinyOnly && !boss.shiny_available) {
          return false;
        }
        if (filters.selectedTypes.length > 0) {
          const hasMatchingType = boss.types.some((type) => filters.selectedTypes.includes(type));
          if (!hasMatchingType) {
            return false;
          }
        }
        if (boss.cp_range.max < filters.minCP || boss.cp_range.min > filters.maxCP) {
          return false;
        }
        return true;
      });

      if (filteredBosses.length > 0) {
        result[tier] = filteredBosses;
      }
    });

    return result;
  }, [data, filters]);

  if (loading) {
    return <DataLoadingSkeleton itemCount={8} gridSize={{ xs: 12, sm: 6, md: 4, lg: 3 }} />;
  }

  if (error || !data || !filteredData) {
    return <DataErrorDisplay title="Failed to Load Raid Boss Data" message={error || undefined} onRetry={refetch} />;
  }

  const renderRaidBossCard = (boss: RaidBoss) => (
    <Card
      key={boss.name}
      className="flex h-full flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-soft-xl"
    >
      <div className="flex h-[140px] items-center justify-center bg-muted p-4">
        <img src={boss.asset_url} alt={boss.name} className="max-h-full max-w-full object-contain" />
      </div>
      <div className="flex-1 p-4">
        <p className="mb-2.5 text-center text-base font-semibold sm:text-lg">{boss.name}</p>

        <div className="flex flex-col gap-2.5">
          <div className="flex flex-wrap justify-center gap-1">
            {boss.types.map((type) => (
              <Badge key={type} size="sm" style={{ backgroundColor: POKEMON_TYPE_COLORS[type] || '#999', color: '#fff' }}>
                {type}
              </Badge>
            ))}
            {boss.shiny_available && <ShinyChip />}
          </div>

          <div className="rounded-md bg-muted p-3">
            <p className="text-xs text-muted-foreground">Normal CP Range</p>
            <p className="text-sm font-semibold">
              {boss.cp_range.min.toLocaleString()} - {boss.cp_range.max.toLocaleString()}
            </p>
          </div>

          <div className="rounded-md bg-muted p-3">
            <p className="text-xs text-muted-foreground">Weather Boosted CP</p>
            <p className="text-sm font-semibold">
              {boss.boosted_cp_range.min.toLocaleString()} - {boss.boosted_cp_range.max.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );

  const renderRaidBossListItem = (boss: RaidBoss) => (
    <Card key={boss.name} className="flex w-full items-center gap-3 p-3">
      <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-md bg-muted">
        <img src={boss.asset_url} alt={boss.name} className="max-h-[80%] max-w-[80%]" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-wrap items-center gap-1.5">
          <p className="text-sm font-semibold">{boss.name}</p>
          {boss.shiny_available && <ShinyChip />}
        </div>
        <div className="flex flex-wrap gap-1">
          {boss.types.map((t) => (
            <Badge key={t} size="sm" style={{ backgroundColor: POKEMON_TYPE_COLORS[t], color: '#fff' }}>
              {t}
            </Badge>
          ))}
        </div>
      </div>
      <div className="hidden min-w-[100px] text-right sm:block">
        <p className="text-xs text-muted-foreground">CP Range</p>
        <p className="text-sm font-semibold">{boss.cp_range.max.toLocaleString()}</p>
      </div>
    </Card>
  );

  return (
    <div className={`py-4 ${isMobile ? 'pb-16' : ''}`}>
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row">
        <PageHeader title="Raid Bosses" description="Current raid bosses available in Pokémon GO" />
        <ToggleGroup type="single" value={viewMode} onValueChange={(v) => v && setViewMode(v as 'grid' | 'list')}>
          <ToggleGroupItem value="grid" aria-label="grid view">
            <LayoutGrid className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="list view">
            <List className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <Alert variant="info" className="mb-6">
        CP ranges help you identify perfect IV catches. Weather boosted ranges indicate the Pokémon is
        level 25 instead of level 20.
      </Alert>

      {Object.entries(filteredData).map(([tier, bosses]) => {
        if (!bosses || bosses.length === 0) return null;

        return (
          <div key={tier} className="mb-8">
            <div className="mb-3 flex items-center gap-2.5">
              <h2 className="text-xl font-bold">{tier}</h2>
              <Badge style={{ backgroundColor: RAID_TIER_COLORS[tier] || 'hsl(var(--primary))', color: '#fff' }}>
                {bosses.length} Boss{bosses.length !== 1 ? 'es' : ''}
              </Badge>
            </div>

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {bosses.map((boss) => renderRaidBossCard(boss))}
              </div>
            ) : (
              <div className="flex flex-col gap-2">{bosses.map((boss) => renderRaidBossListItem(boss))}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default React.memo(RaidBossesPage);
