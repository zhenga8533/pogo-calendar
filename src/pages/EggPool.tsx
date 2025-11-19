import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import {
  Alert,
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { ShinyChip } from '../components/filters/shared';
import { DataErrorDisplay } from '../components/shared/DataErrorDisplay';
import { DataLoadingSkeleton } from '../components/shared/DataLoadingSkeleton';
import { PageHeader } from '../components/shared/PageHeader';
import { EGG_COLORS, RARITY_TIERS } from '../config/colorMapping';
import { usePageData } from '../hooks/usePageData';
import { fetchEggPool } from '../services/dataService';
import type { EggPokemon, EggPoolData } from '../types/eggPool';
import type { EggPoolFilters } from '../types/pageFilters';

interface EggPoolPageProps {
  filters: EggPoolFilters;
  onSetFilterOptions: (options: {
    eggTiers: string[];
    rarityTiers: string[];
  }) => void;
}

function EggPoolPage({ filters, onSetFilterOptions }: EggPoolPageProps) {
  const { data, loading, error, refetch } = usePageData<EggPoolData>(
    fetchEggPool,
    'Failed to load egg pool data. Please try again later.'
  );
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Extract and set available filter options from data
  useEffect(() => {
    if (data) {
      const eggTiers = Object.keys(data);
      const rarityTiers = Object.values(RARITY_TIERS).map((tier) => tier.label);
      onSetFilterOptions({ eggTiers, rarityTiers });
    }
  }, [data, onSetFilterOptions]);

  // Filter the data based on filters
  const filteredData = useMemo(() => {
    if (!data) return null;

    const result: EggPoolData = {};

    Object.entries(data).forEach(([tier, pokemon]) => {
      // Filter by egg tier
      if (
        filters.selectedEggTiers.length > 0 &&
        !filters.selectedEggTiers.includes(tier)
      ) {
        return;
      }

      // Filter pokemon within this tier
      const filteredPokemon = pokemon.filter((p) => {
        // Filter by pokemon name
        if (
          filters.pokemonSearch &&
          !p.name.toLowerCase().includes(filters.pokemonSearch.toLowerCase())
        ) {
          return false;
        }

        // Filter by shiny availability
        if (filters.shinyOnly && !p.shiny_available) {
          return false;
        }

        // Filter by rarity tier
        if (filters.selectedRarityTiers.length > 0) {
          const rarityLabel = RARITY_TIERS[p.rarity_tier]?.label;
          if (
            !rarityLabel ||
            !filters.selectedRarityTiers.includes(rarityLabel)
          ) {
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
    return (
      <DataLoadingSkeleton
        itemCount={8}
        gridSize={{ xs: 6, sm: 4, md: 3, lg: 2 }}
      />
    );
  }

  if (error || !data || !filteredData) {
    return (
      <DataErrorDisplay
        title="Failed to Load Egg Pool Data"
        message={error || undefined}
        onRetry={refetch}
      />
    );
  }

  const renderPokemonCard = (pokemon: EggPokemon) => (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.shadows[8],
        },
      }}
    >
      <CardMedia
        component="img"
        image={pokemon.asset_url}
        alt={pokemon.name}
        sx={{
          height: 120,
          objectFit: 'contain',
          backgroundColor: 'background.default',
          p: 2,
        }}
      />
      <CardContent sx={{ flexGrow: 1, pt: 1 }}>
        <Typography
          variant="subtitle1"
          fontWeight={600}
          textAlign="center"
          gutterBottom
          sx={{ fontSize: isMobile ? '0.875rem' : '1rem' }}
        >
          {pokemon.name}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 0.5,
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          {pokemon.shiny_available && <ShinyChip />}
          <Chip
            label={RARITY_TIERS[pokemon.rarity_tier]?.label || 'Unknown'}
            size="small"
            sx={{
              height: 20,
              fontSize: '0.7rem',
              backgroundColor:
                RARITY_TIERS[pokemon.rarity_tier]?.color || '#999',
              color: '#fff',
              fontWeight: 600,
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );

  const renderPokemonListItem = (pokemon: EggPokemon) => (
    <Card
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 1.5,
        gap: 2,
        width: '100%',
      }}
    >
      <Box
        sx={{
          width: 50,
          height: 50,
          bgcolor: 'background.default',
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Box
          component="img"
          src={pokemon.asset_url}
          alt={pokemon.name}
          sx={{ maxWidth: '80%', maxHeight: '80%' }}
        />
      </Box>
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
          <Typography variant="subtitle2" fontWeight={600}>
            {pokemon.name}
          </Typography>
          {pokemon.shiny_available && <ShinyChip />}
        </Stack>
      </Box>
      <Chip
        label={RARITY_TIERS[pokemon.rarity_tier]?.label || 'Unknown'}
        size="small"
        sx={{
          height: 20,
          fontSize: '0.7rem',
          backgroundColor: RARITY_TIERS[pokemon.rarity_tier]?.color || '#999',
          color: '#fff',
          fontWeight: 600,
          minWidth: 80,
        }}
      />
    </Card>
  );

  return (
    <Box sx={{ py: 4, pb: isMobile ? 8 : 4 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        mb={3}
      >
        <PageHeader
          title="Egg Pool"
          description="Current Pokémon available from different egg types"
        />
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, newView) => newView && setViewMode(newView)}
          size="small"
          aria-label="view mode"
        >
          <ToggleButton value="grid" aria-label="grid view">
            <ViewModuleIcon />
          </ToggleButton>
          <ToggleButton value="list" aria-label="list view">
            <ViewListIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      <Alert severity="info" sx={{ mb: 3 }}>
        Egg contents are updated regularly based on current in-game events.
        Rarity tiers indicate the relative hatch chance.
      </Alert>

      {Object.entries(filteredData).map(([tier, pokemon]) => {
        if (!pokemon || pokemon.length === 0) return null;

        return (
          <Box key={tier} sx={{ mb: 4 }}>
            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
              <Typography variant="h5" fontWeight={600}>
                {tier}
              </Typography>
              <Chip
                label={`${pokemon.length} Pokémon`}
                size="small"
                sx={{
                  backgroundColor: (theme) =>
                    EGG_COLORS[tier] || theme.palette.primary.main,
                  color: '#fff',
                  fontWeight: 600,
                }}
              />
            </Stack>

            {viewMode === 'grid' ? (
              <Grid container spacing={2}>
                {pokemon.map((p) => (
                  <Grid key={p.name} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
                    {renderPokemonCard(p)}
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Stack spacing={1}>
                {pokemon.map((p) => renderPokemonListItem(p))}
              </Stack>
            )}
          </Box>
        );
      })}
    </Box>
  );
}

export default React.memo(EggPoolPage);
