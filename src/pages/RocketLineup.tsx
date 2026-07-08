import React, { useEffect, useMemo, useState } from 'react';
import { ShinyChip } from '../components/filters/shared';
import { DataErrorDisplay } from '../components/shared/DataErrorDisplay';
import { DataLoadingSkeleton } from '../components/shared/DataLoadingSkeleton';
import { NoResults } from '../components/shared/NoResults';
import { PageHeader } from '../components/shared/PageHeader';
import { SectionHeader } from '../components/shared/SectionHeader';
import { ViewModeToggle, type ViewMode } from '../components/shared/ViewModeToggle';
import { Alert } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { ROCKET_LEADER_COLORS, ROCKET_LEADER_DESCRIPTIONS } from '../config/colorMapping';
import { MOBILE_QUERY, useMediaQuery } from '../hooks/useMediaQuery';
import { usePageData } from '../hooks/usePageData';
import { fetchRocketLineup } from '../services/dataService';
import type { RocketLineupFilters } from '../types/pageFilters';
import type { RocketLeader, RocketLineupData, RocketPokemon, RocketSlot } from '../types/rocketLineup';

const LEADER_ORDER: RocketLeader[] = ['Giovanni', 'Cliff', 'Sierra', 'Arlo'];

interface RocketLineupPageProps {
  filters: RocketLineupFilters;
  onSetFilterOptions: (options: { leaders: string[] }) => void;
}

function RocketLineupPage({ filters, onSetFilterOptions }: RocketLineupPageProps) {
  const { data, loading, error, refetch } = usePageData<RocketLineupData>(
    fetchRocketLineup,
    'Failed to load Team GO Rocket lineup data. Please try again later.'
  );
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  useEffect(() => {
    if (data) {
      const leaders = Object.keys(data);
      onSetFilterOptions({ leaders });
    }
  }, [data, onSetFilterOptions]);

  const filteredData = useMemo(() => {
    if (!data) return null;

    const result: RocketLineupData = {};

    Object.entries(data).forEach(([leader, lineup]) => {
      if (filters.selectedLeaders.length > 0 && !filters.selectedLeaders.includes(leader)) {
        return;
      }

      const filteredSlots = lineup
        .filter((slot) => {
          if (filters.selectedSlots.length > 0 && !filters.selectedSlots.includes(slot.slot)) {
            return false;
          }
          if (filters.encounterOnly && !slot.is_encounter) {
            return false;
          }

          const hasmatchingPokemon = slot.pokemons.some((pokemon) => {
            if (
              filters.pokemonSearch &&
              !pokemon.name.toLowerCase().includes(filters.pokemonSearch.toLowerCase())
            ) {
              return false;
            }
            if (filters.shinyOnly && !pokemon.shiny_available) {
              return false;
            }
            return true;
          });

          if (filters.pokemonSearch || filters.shinyOnly) {
            return hasmatchingPokemon;
          }

          return true;
        })
        .map((slot) => {
          if (filters.pokemonSearch || filters.shinyOnly) {
            return {
              ...slot,
              pokemons: slot.pokemons.filter((pokemon) => {
                if (
                  filters.pokemonSearch &&
                  !pokemon.name.toLowerCase().includes(filters.pokemonSearch.toLowerCase())
                ) {
                  return false;
                }
                if (filters.shinyOnly && !pokemon.shiny_available) {
                  return false;
                }
                return true;
              }),
            };
          }
          return slot;
        });

      if (filteredSlots.length > 0) {
        result[leader] = filteredSlots;
      }
    });

    return result;
  }, [data, filters]);

  if (loading) {
    return <DataLoadingSkeleton itemCount={4} gridSize={{ xs: 12 }} />;
  }

  if (error || !data || !filteredData) {
    return (
      <DataErrorDisplay title="Failed to Load Team GO Rocket Lineup" message={error || undefined} onRetry={refetch} />
    );
  }

  const renderPokemon = (pokemon: RocketPokemon) => (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-muted p-3">
      <div className="flex h-14 w-14 min-w-14 items-center justify-center overflow-hidden rounded-md bg-card">
        <img src={pokemon.asset_url} alt={pokemon.name} className="max-h-full max-w-full object-contain" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{pokemon.name}</p>
        {pokemon.shiny_available && (
          <div className="mt-1">
            <ShinyChip />
          </div>
        )}
      </div>
    </div>
  );

  const renderSlot = (slot: RocketSlot) => (
    <div key={slot.slot} className="mb-4 last:mb-0">
      <div className="mb-2.5 flex flex-wrap items-center gap-2.5">
        <SectionHeader
          title={`Slot ${slot.slot}`}
          count={slot.pokemons.length}
          label="Pokémon"
          className="mb-0"
        />
        {slot.is_encounter && (
          <Badge style={{ backgroundColor: '#4CAF50', color: '#fff' }}>Possible Encounter</Badge>
        )}
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
        {slot.pokemons.map((pokemon, idx) => (
          <React.Fragment key={idx}>{renderPokemon(pokemon)}</React.Fragment>
        ))}
      </div>
    </div>
  );

  const renderLeaderCard = (leader: string, lineup: RocketSlot[]) => (
    <Card
      key={leader}
      className="overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-soft-lg"
    >
      <div
        className="p-6 text-white"
        style={{
          background: `linear-gradient(135deg, ${ROCKET_LEADER_COLORS[leader] || 'hsl(var(--primary))'} 0%, ${
            ROCKET_LEADER_COLORS[leader] || 'hsl(var(--primary))'
          }dd 100%)`,
        }}
      >
        <h2 className="mb-1.5 text-2xl font-bold">{leader}</h2>
        <p className="text-sm opacity-90">{ROCKET_LEADER_DESCRIPTIONS[leader] || 'Team GO Rocket'}</p>
      </div>
      <CardContent className="p-6">
        <div className="flex flex-col">
          {[...lineup]
            .sort((a, b) => a.slot - b.slot)
            .map((slot, i) => (
              <React.Fragment key={slot.slot}>
                {i > 0 && <Separator className="mb-4" />}
                {renderSlot(slot)}
              </React.Fragment>
            ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderLeaderListItem = (leader: string, lineup: RocketSlot[]) => (
    <Card
      key={leader}
      className="flex flex-col gap-3 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-soft-lg"
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge style={{ backgroundColor: ROCKET_LEADER_COLORS[leader] || 'hsl(var(--primary))', color: '#fff' }}>
          {leader}
        </Badge>
        <p className="text-xs text-muted-foreground">
          {ROCKET_LEADER_DESCRIPTIONS[leader] || 'Team GO Rocket'}
        </p>
      </div>
      <div className="flex flex-wrap gap-4">
        {[...lineup]
          .sort((a, b) => a.slot - b.slot)
          .map((slot) => (
            <div key={slot.slot} className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-muted-foreground">Slot {slot.slot}</span>
                {slot.is_encounter && (
                  <Badge size="sm" style={{ backgroundColor: '#4CAF50', color: '#fff' }}>
                    Encounter
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {slot.pokemons.map((pokemon, idx) => (
                  <div
                    key={idx}
                    className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-md bg-muted"
                    title={pokemon.name}
                  >
                    <img src={pokemon.asset_url} alt={pokemon.name} className="max-h-full max-w-full object-contain" />
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </Card>
  );

  const orderedLeaders = Object.keys(filteredData).sort((a, b) => {
    const aIndex = LEADER_ORDER.indexOf(a as RocketLeader);
    const bIndex = LEADER_ORDER.indexOf(b as RocketLeader);
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return a.localeCompare(b);
  });

  return (
    <div className={`py-4 ${isMobile ? 'pb-16' : ''}`}>
      <PageHeader
        title="Team GO Rocket Lineups"
        description="Current Pokémon used by Team GO Rocket leaders"
        actions={<ViewModeToggle value={viewMode} onChange={setViewMode} />}
      />

      <Alert variant="info" className="mb-6">
        Team GO Rocket leaders use one Pokémon from each slot. Defeating the leader gives you a chance to
        catch the encounter Pokémon (usually from slot 3).
      </Alert>

      {orderedLeaders.length === 0 && <NoResults />}

      <div className={viewMode === 'grid' ? 'grid grid-cols-1 gap-6 xl:grid-cols-2' : 'flex flex-col gap-2'}>
        {orderedLeaders.map((leader) => {
          const lineup = filteredData[leader];
          if (!lineup || lineup.length === 0) return null;
          return viewMode === 'grid' ? renderLeaderCard(leader, lineup) : renderLeaderListItem(leader, lineup);
        })}
      </div>
    </div>
  );
}

export default React.memo(RocketLineupPage);
