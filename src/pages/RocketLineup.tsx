import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import React from 'react';
import { DataErrorDisplay } from '../components/shared/DataErrorDisplay';
import { DataLoadingSkeleton } from '../components/shared/DataLoadingSkeleton';
import {
  ROCKET_LEADER_COLORS,
  ROCKET_LEADER_DESCRIPTIONS,
  SHINY_COLOR,
} from '../config/colorMapping';
import { usePageData } from '../hooks/usePageData';
import { fetchRocketLineup } from '../services/dataService';
import type {
  RocketLineupData,
  RocketPokemon,
  RocketSlot,
} from '../types/rocketLineup';

function RocketLineupPage() {
  const { data, loading, error, refetch } = usePageData<RocketLineupData>(
    fetchRocketLineup,
    'Failed to load Team GO Rocket lineup data. Please try again later.'
  );

  if (loading) {
    return <DataLoadingSkeleton itemCount={4} gridSize={{ xs: 12 }} />;
  }

  if (error || !data) {
    return (
      <DataErrorDisplay
        title="Failed to Load Team GO Rocket Lineup"
        message={error || undefined}
        onRetry={refetch}
      />
    );
  }

  const renderPokemon = (pokemon: RocketPokemon) => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        p: 1.5,
        backgroundColor: 'background.default',
        borderRadius: 1,
      }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          minWidth: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'background.paper',
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src={pokemon.asset_url}
          alt={pokemon.name}
          sx={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
          }}
        />
      </Box>
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Typography variant="body2" fontWeight={600} noWrap>
          {pokemon.name}
        </Typography>
        {pokemon.shiny_available && (
          <Chip
            label="✨ Shiny"
            size="small"
            sx={{
              height: 18,
              fontSize: '0.65rem',
              backgroundColor: SHINY_COLOR,
              color: '#000',
              fontWeight: 600,
              mt: 0.5,
            }}
          />
        )}
      </Box>
    </Box>
  );

  const renderSlot = (slot: RocketSlot) => (
    <Box key={slot.slot} sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
        <Chip
          label={`Slot ${slot.slot}`}
          size="small"
          sx={{
            backgroundColor: 'primary.main',
            color: '#fff',
            fontWeight: 600,
          }}
        />
        {slot.is_encounter && (
          <Chip
            label="Possible Encounter"
            size="small"
            sx={{
              backgroundColor: '#4CAF50',
              color: '#fff',
              fontWeight: 600,
            }}
          />
        )}
      </Box>
      <Grid container spacing={1}>
        {slot.pokemons.map((pokemon, idx) => (
          <Grid key={idx} size={{ xs: 12, sm: 6, md: 4 }}>
            {renderPokemon(pokemon)}
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderLeaderCard = (leader: string, lineup: RocketSlot[]) => (
    <Card
      key={leader}
      sx={{
        mb: 3,
        overflow: 'hidden',
        borderRadius: 3,
      }}
    >
      <Box
        sx={{
          background: (theme) =>
            `linear-gradient(135deg, ${
              ROCKET_LEADER_COLORS[leader] || theme.palette.primary.main
            } 0%, ${
              ROCKET_LEADER_COLORS[leader] || theme.palette.primary.main
            }dd 100%)`,
          p: 3,
          color: '#fff',
        }}
      >
        <Typography variant="h4" fontWeight={700} gutterBottom>
          {leader}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          {ROCKET_LEADER_DESCRIPTIONS[leader] || 'Team GO Rocket'}
        </Typography>
      </Box>
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2} divider={<Divider />}>
          {lineup
            .sort((a, b) => a.slot - b.slot)
            .map((slot) => renderSlot(slot))}
        </Stack>
      </CardContent>
    </Card>
  );

  // Order leaders: Giovanni first, then alphabetically
  const orderedLeaders = Object.keys(data).sort((a, b) => {
    if (a === 'Giovanni') return -1;
    if (b === 'Giovanni') return 1;
    return a.localeCompare(b);
  });

  return (
    <Box sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight={700} gutterBottom>
          Team GO Rocket Lineups
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Current Pokémon used by Team GO Rocket leaders
        </Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        Team GO Rocket leaders use one Pokémon from each slot. Defeating the
        leader gives you a chance to catch the encounter Pokémon (usually from
        slot 3).
      </Alert>

      {orderedLeaders.map((leader) => {
        const lineup = data[leader];
        if (!lineup || lineup.length === 0) return null;
        return renderLeaderCard(leader, lineup);
      })}
    </Box>
  );
}

export default React.memo(RocketLineupPage);
