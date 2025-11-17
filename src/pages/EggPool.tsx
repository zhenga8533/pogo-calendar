import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Card,
  CardContent,
  CardMedia,
  Skeleton,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { fetchEggPool } from '../services/dataService';
import type { EggPoolData, EggTier, EggPokemon } from '../types/eggPool';

const EGG_COLORS: Record<string, string> = {
  '2 km Eggs': '#4CAF50',
  '5 km Eggs': '#FFA726',
  '7 km Eggs': '#FDD835',
  '10 km Eggs': '#AB47BC',
  '12 km Eggs': '#EF5350',
};

const RARITY_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: 'Common', color: '#78909C' },
  2: { label: 'Uncommon', color: '#66BB6A' },
  3: { label: 'Rare', color: '#42A5F5' },
  4: { label: 'Very Rare', color: '#AB47BC' },
  5: { label: 'Ultra Rare', color: '#FFA726' },
};

function EggPoolPage() {
  const [data, setData] = useState<EggPoolData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const eggData = await fetchEggPool();
        setData(eggData);
      } catch (err) {
        setError('Failed to load egg pool data. Please try again later.');
        console.error('Error loading egg pool:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ py: 4 }}>
        <Skeleton variant="text" width={200} height={60} sx={{ mb: 3 }} />
        {[1, 2, 3].map((i) => (
          <Box key={i} sx={{ mb: 4 }}>
            <Skeleton variant="text" width={150} height={40} sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              {[1, 2, 3, 4].map((j) => (
                <Grid key={j} item xs={6} sm={4} md={3} lg={2}>
                  <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
                </Grid>
              ))}
            </Grid>
          </Box>
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
          Failed to Load Egg Pool Data
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {error || 'An unexpected error occurred'}
        </Typography>
      </Paper>
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
          boxShadow: theme.shadows[8],
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
        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center', flexWrap: 'wrap' }}>
          {pokemon.shiny_available && (
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
          <Chip
            label={RARITY_LABELS[pokemon.rarity_tier]?.label || 'Unknown'}
            size="small"
            sx={{
              height: 20,
              fontSize: '0.7rem',
              backgroundColor: RARITY_LABELS[pokemon.rarity_tier]?.color || '#999',
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
        Egg contents are updated regularly based on current in-game events. Rarity tiers indicate
        the relative hatch chance.
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
                  backgroundColor: EGG_COLORS[tier] || theme.palette.primary.main,
                  color: '#fff',
                  fontWeight: 600,
                }}
              />
            </Box>
            <Grid container spacing={2}>
              {pokemon.map((p) => (
                <Grid key={p.name} item xs={6} sm={4} md={3} lg={2}>
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

export default EggPoolPage;
