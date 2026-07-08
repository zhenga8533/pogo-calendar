import { LayoutGrid, List } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { ShinyChip } from '../components/filters/shared';
import { DataErrorDisplay } from '../components/shared/DataErrorDisplay';
import { DataLoadingSkeleton } from '../components/shared/DataLoadingSkeleton';
import { PageHeader } from '../components/shared/PageHeader';
import { SectionHeader } from '../components/shared/SectionHeader';
import { Alert } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';
import { Card } from '../components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '../components/ui/toggle-group';
import { EGG_COLORS, RARITY_TIERS } from '../config/colorMapping';
import { MOBILE_QUERY, useMediaQuery } from '../hooks/useMediaQuery';
import { usePageData } from '../hooks/usePageData';
import { fetchEggPool } from '../services/dataService';
import type { EggPokemon, EggPoolData } from '../types/eggPool';
import type { EggPoolFilters } from '../types/pageFilters';

interface EggPoolPageProps {
  filters: EggPoolFilters;
  onSetFilterOptions: (options: { eggTiers: string[]; rarityTiers: string[] }) => void;
}

function EggPoolPage({ filters, onSetFilterOptions }: EggPoolPageProps) {
  const { data, loading, error, refetch } = usePageData<EggPoolData>(
    fetchEggPool,
    'Failed to load egg pool data. Please try again later.'
  );
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    if (data) {
      const eggTiers = Object.keys(data);
      const rarityTiers = Object.values(RARITY_TIERS).map((tier) => tier.label);
      onSetFilterOptions({ eggTiers, rarityTiers });
    }
  }, [data, onSetFilterOptions]);

  const filteredData = useMemo(() => {
    if (!data) return null;

    const result: EggPoolData = {};

    Object.entries(data).forEach(([tier, pokemon]) => {
      if (filters.selectedEggTiers.length > 0 && !filters.selectedEggTiers.includes(tier)) {
        return;
      }

      const filteredPokemon = pokemon.filter((p) => {
        if (filters.pokemonSearch && !p.name.toLowerCase().includes(filters.pokemonSearch.toLowerCase())) {
          return false;
        }
        if (filters.shinyOnly && !p.shiny_available) {
          return false;
        }
        if (filters.selectedRarityTiers.length > 0) {
          const rarityLabel = RARITY_TIERS[p.rarity_tier]?.label;
          if (!rarityLabel || !filters.selectedRarityTiers.includes(rarityLabel)) {
            return false;
          }
        }
        return true;
      });

      if (filteredPokemon.length > 0) {
        result[tier] = filteredPokemon;
      }
    });

    return result;
  }, [data, filters]);

  if (loading) {
    return <DataLoadingSkeleton itemCount={8} gridSize={{ xs: 6, sm: 4, md: 3, lg: 2 }} />;
  }

  if (error || !data || !filteredData) {
    return <DataErrorDisplay title="Failed to Load Egg Pool Data" message={error || undefined} onRetry={refetch} />;
  }

  const renderPokemonCard = (pokemon: EggPokemon) => (
    <Card
      key={pokemon.name}
      className="flex h-full flex-col overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-soft-lg"
    >
      <div className="flex h-[120px] items-center justify-center bg-muted p-4">
        <img src={pokemon.asset_url} alt={pokemon.name} className="max-h-full max-w-full object-contain" />
      </div>
      <div className="flex-1 p-3 pt-2 text-center">
        <p className="mb-1.5 text-sm font-semibold sm:text-base">{pokemon.name}</p>
        <div className="flex flex-wrap justify-center gap-1">
          {pokemon.shiny_available && <ShinyChip />}
          <Badge
            size="sm"
            style={{ backgroundColor: RARITY_TIERS[pokemon.rarity_tier]?.color || '#999', color: '#fff' }}
          >
            {RARITY_TIERS[pokemon.rarity_tier]?.label || 'Unknown'}
          </Badge>
        </div>
      </div>
    </Card>
  );

  const renderPokemonListItem = (pokemon: EggPokemon) => (
    <Card key={pokemon.name} className="flex w-full items-center gap-3 p-3">
      <div className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-md bg-muted">
        <img src={pokemon.asset_url} alt={pokemon.name} className="max-h-[80%] max-w-[80%]" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <p className="text-sm font-semibold">{pokemon.name}</p>
          {pokemon.shiny_available && <ShinyChip />}
        </div>
      </div>
      <Badge
        size="sm"
        className="min-w-20 justify-center"
        style={{ backgroundColor: RARITY_TIERS[pokemon.rarity_tier]?.color || '#999', color: '#fff' }}
      >
        {RARITY_TIERS[pokemon.rarity_tier]?.label || 'Unknown'}
      </Badge>
    </Card>
  );

  return (
    <div className={`py-4 ${isMobile ? 'pb-16' : ''}`}>
      <PageHeader
        title="Egg Pool"
        description="Current Pokémon available from different egg types"
        actions={
          <ToggleGroup
            type="single"
            value={viewMode}
            onValueChange={(v) => v && setViewMode(v as 'grid' | 'list')}
          >
            <ToggleGroupItem value="grid" aria-label="grid view">
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="list view">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        }
      />

      <Alert variant="info" className="mb-6">
        Egg contents are updated regularly based on current in-game events. Rarity tiers indicate the
        relative hatch chance.
      </Alert>

      {Object.entries(filteredData).map(([tier, pokemon]) => {
        if (!pokemon || pokemon.length === 0) return null;

        return (
          <div key={tier} className="mb-8">
            <SectionHeader
              title={tier}
              count={pokemon.length}
              label="Pokémon"
              color={EGG_COLORS[tier] || 'hsl(var(--primary))'}
            />

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {pokemon.map((p) => renderPokemonCard(p))}
              </div>
            ) : (
              <div className="flex flex-col gap-2">{pokemon.map((p) => renderPokemonListItem(p))}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default React.memo(EggPoolPage);
