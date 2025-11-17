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
  Stack,
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { fetchRaidBosses } from '../services/dataService';
import type { RaidBossData, RaidBoss } from '../types/raidBosses';

const TIER_COLORS: Record<string, string> = {
  'Tier 1': '#F48FB1',
  'Tier 3': '#FFB74D',
  'Tier 5': '#BA68C8',
  'Mega Raids': '#4FC3F7',
};

const TYPE_COLORS: Record<string, string> = {
  Normal: '#A8A77A',
  Fire: '#EE8130',
  Water: '#6390F0',
  Electric: '#F7D02C',
  Grass: '#7AC74C',
  Ice: '#96D9D6',
  Fighting: '#C22E28',
  Poison: '#A33EA1',
  Ground: '#E2BF65',
  Flying: '#A98FF3',
  Psychic: '#F95587',
  Bug: '#A6B91A',
  Rock: '#B6A136',
  Ghost: '#735797',
  Dragon: '#6F35FC',
  Dark: '#705746',
  Steel: '#B7B7CE',
  Fairy: '#D685AD',
};

function RaidBossesPage() {
  const [data, setData] = useState<RaidBossData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const raidData = await fetchRaidBosses();
        setData(raidData);
      } catch (err) {
        setError('Failed to load raid boss data. Please try again later.');
        console.error('Error loading raid bosses:', err);
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
                <Grid key={j} item xs={12} sm={6} md={4}>
                  <Skeleton variant="rectangular" height={250} sx={{ borderRadius: 2 }} />
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
          Failed to Load Raid Boss Data
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {error || 'An unexpected error occurred'}
        </Typography>
      </Paper>
    );
  }

  const renderRaidBossCard = (boss: RaidBoss) => (
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
        image={boss.asset_url}
        alt={boss.name}
        sx={{
          height: 140,
          objectFit: 'contain',
          backgroundColor: 'background.default',
          p: 2,
        }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          variant="h6"
          fontWeight={600}
          textAlign="center"
          gutterBottom
          sx={{ fontSize: isMobile ? '1rem' : '1.25rem' }}
        >
          {boss.name}
        </Typography>

        <Stack spacing={1} sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center', flexWrap: 'wrap' }}>
            {boss.types.map((type) => (
              <Chip
                key={type}
                label={type}
                size="small"
                sx={{
                  backgroundColor: TYPE_COLORS[type] || '#999',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                }}
              />
            ))}
            {boss.shiny_available && (
              <Chip
                label="✨ Shiny"
                size="small"
                sx={{
                  backgroundColor: '#FFD700',
                  color: '#000',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                }}
              />
            )}
          </Box>

          <Box
            sx={{
              backgroundColor: 'background.default',
              borderRadius: 1,
              p: 1.5,
            }}
          >
            <Typography variant="caption" color="text.secondary" display="block">
              Normal CP Range
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {boss.cp_range.min.toLocaleString()} - {boss.cp_range.max.toLocaleString()}
            </Typography>
          </Box>

          <Box
            sx={{
              backgroundColor: 'background.default',
              borderRadius: 1,
              p: 1.5,
            }}
          >
            <Typography variant="caption" color="text.secondary" display="block">
              Weather Boosted CP
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {boss.boosted_cp_range.min.toLocaleString()} -{' '}
              {boss.boosted_cp_range.max.toLocaleString()}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight={700} gutterBottom>
          Raid Bosses
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Current raid bosses available in Pokémon GO
        </Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        CP ranges help you identify perfect IV catches. Weather boosted ranges indicate the Pokémon
        is level 25 instead of level 20.
      </Alert>

      {Object.entries(data).map(([tier, bosses]) => {
        if (!bosses || bosses.length === 0) return null;

        return (
          <Box key={tier} sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography variant="h5" fontWeight={600}>
                {tier}
              </Typography>
              <Chip
                label={`${bosses.length} Boss${bosses.length !== 1 ? 'es' : ''}`}
                size="small"
                sx={{
                  backgroundColor: TIER_COLORS[tier] || theme.palette.primary.main,
                  color: '#fff',
                  fontWeight: 600,
                }}
              />
            </Box>
            <Grid container spacing={2}>
              {bosses.map((boss) => (
                <Grid key={boss.name} item xs={12} sm={6} md={4} lg={3}>
                  {renderRaidBossCard(boss)}
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      })}
    </Box>
  );
}

export default RaidBossesPage;
