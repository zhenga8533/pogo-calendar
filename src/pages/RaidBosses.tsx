import {
  Alert,
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React from 'react';
import { DataErrorDisplay } from '../components/shared/DataErrorDisplay';
import { DataLoadingSkeleton } from '../components/shared/DataLoadingSkeleton';
import {
  POKEMON_TYPE_COLORS,
  RAID_TIER_COLORS,
  SHINY_COLOR,
} from '../config/colorMapping';
import { usePageData } from '../hooks/usePageData';
import { fetchRaidBosses } from '../services/dataService';
import type { RaidBoss, RaidBossData } from '../types/raidBosses';

function RaidBossesPage() {
  const { data, loading, error, refetch } = usePageData<RaidBossData>(
    fetchRaidBosses,
    'Failed to load raid boss data. Please try again later.'
  );
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (loading) {
    return (
      <DataLoadingSkeleton
        itemCount={8}
        gridSize={{ xs: 12, sm: 6, md: 4, lg: 3 }}
      />
    );
  }

  if (error || !data) {
    return (
      <DataErrorDisplay
        title="Failed to Load Raid Boss Data"
        message={error || undefined}
        onRetry={refetch}
      />
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
          boxShadow: (theme) => theme.shadows[8],
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
          <Box
            sx={{
              display: 'flex',
              gap: 0.5,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            {boss.types.map((type) => (
              <Chip
                key={type}
                label={type}
                size="small"
                sx={{
                  backgroundColor: POKEMON_TYPE_COLORS[type] || '#999',
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
                  backgroundColor: SHINY_COLOR,
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
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              Normal CP Range
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {boss.cp_range.min.toLocaleString()} -{' '}
              {boss.cp_range.max.toLocaleString()}
            </Typography>
          </Box>

          <Box
            sx={{
              backgroundColor: 'background.default',
              borderRadius: 1,
              p: 1.5,
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
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
        CP ranges help you identify perfect IV catches. Weather boosted ranges
        indicate the Pokémon is level 25 instead of level 20.
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
                label={`${bosses.length} Boss${
                  bosses.length !== 1 ? 'es' : ''
                }`}
                size="small"
                sx={{
                  backgroundColor: (theme) =>
                    RAID_TIER_COLORS[tier] || theme.palette.primary.main,
                  color: '#fff',
                  fontWeight: 600,
                }}
              />
            </Box>
            <Grid container spacing={2}>
              {bosses.map((boss) => (
                <Grid key={boss.name} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
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

export default React.memo(RaidBossesPage);
