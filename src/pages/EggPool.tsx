import {
  Alert,
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React from 'react';
import { DataErrorDisplay } from '../components/shared/DataErrorDisplay';
import { DataLoadingSkeleton } from '../components/shared/DataLoadingSkeleton';
import { EGG_COLORS, RARITY_TIERS, SHINY_COLOR } from '../config/colorMapping';
import { usePageData } from '../hooks/usePageData';
import { fetchEggPool } from '../services/dataService';
import type { EggPokemon, EggPoolData } from '../types/eggPool';

function EggPoolPage() {
  const { data, loading, error, refetch } = usePageData<EggPoolData>(
    fetchEggPool,
    'Failed to load egg pool data. Please try again later.'
  );
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (loading) {
    return (
      <DataLoadingSkeleton
        itemCount={8}
        gridSize={{ xs: 6, sm: 4, md: 3, lg: 2 }}
      />
    );
  }

  if (error || !data) {
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
          {pokemon.shiny_available && (
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

  return (
    <Box sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight={700} gutterBottom>
          Egg Pool
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Current Pokémon available from different egg types
        </Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        Egg contents are updated regularly based on current in-game events.
        Rarity tiers indicate the relative hatch chance.
      </Alert>

      {Object.entries(data).map(([tier, pokemon]) => {
        if (!pokemon || pokemon.length === 0) return null;

        return (
          <Box key={tier} sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
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
            </Box>
            <Grid container spacing={2}>
              {pokemon.map((p) => (
                <Grid key={p.name} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
                  {renderPokemonCard(p)}
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      })}
    </Box>
  );
}

export default React.memo(EggPoolPage);
