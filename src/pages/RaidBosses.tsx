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
import { POKEMON_TYPE_COLORS, RAID_TIER_COLORS } from '../config/colorMapping';
import { usePageData } from '../hooks/usePageData';
import { fetchRaidBosses } from '../services/dataService';
import type { RaidBossFilters } from '../types/pageFilters';
import type { RaidBoss, RaidBossData } from '../types/raidBosses';

interface RaidBossesPageProps {
  filters: RaidBossFilters;
  onSetFilterOptions: (options: {
    raidTiers: string[];
    types: string[];
  }) => void;
}

function RaidBossesPage({ filters, onSetFilterOptions }: RaidBossesPageProps) {
  const { data, loading, error, refetch } = usePageData<RaidBossData>(
    fetchRaidBosses,
    'Failed to load raid boss data. Please try again later.'
  );
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Extract and set available filter options from data
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

  // Filter the data based on filters
  const filteredData = useMemo(() => {
    if (!data) return null;

    const result: RaidBossData = {};

    Object.entries(data).forEach(([tier, bosses]) => {
      // Filter by raid tier
      if (
        filters.selectedRaidTiers.length > 0 &&
        !filters.selectedRaidTiers.includes(tier)
      ) {
        return;
      }

      // Filter bosses within this tier
      const filteredBosses = bosses.filter((boss) => {
        if (
          filters.pokemonSearch &&
          !boss.name.toLowerCase().includes(filters.pokemonSearch.toLowerCase())
        ) {
          return false;
        }
        if (filters.shinyOnly && !boss.shiny_available) {
          return false;
        }
        if (filters.selectedTypes.length > 0) {
          const hasMatchingType = boss.types.some((type) =>
            filters.selectedTypes.includes(type)
          );
          if (!hasMatchingType) {
            return false;
          }
        }
        if (
          boss.cp_range.max < filters.minCP ||
          boss.cp_range.min > filters.maxCP
        ) {
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
    return (
      <DataLoadingSkeleton
        itemCount={8}
        gridSize={{ xs: 12, sm: 6, md: 4, lg: 3 }}
      />
    );
  }

  if (error || !data || !filteredData) {
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
            {boss.shiny_available && <ShinyChip />}
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

  const renderRaidBossListItem = (boss: RaidBoss) => (
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
          width: 60,
          height: 60,
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
          src={boss.asset_url}
          alt={boss.name}
          sx={{ maxWidth: '80%', maxHeight: '80%' }}
        />
      </Box>
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          mb={0.5}
          flexWrap="wrap"
        >
          <Typography variant="subtitle1" fontWeight={600}>
            {boss.name}
          </Typography>
          {boss.shiny_available && <ShinyChip />}
        </Stack>
        <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
          {boss.types.map((t) => (
            <Chip
              key={t}
              label={t}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.7rem',
                bgcolor: POKEMON_TYPE_COLORS[t],
                color: '#fff',
                fontWeight: 600,
              }}
            />
          ))}
        </Stack>
      </Box>
      <Box
        sx={{
          textAlign: 'right',
          minWidth: 100,
          display: { xs: 'none', sm: 'block' },
        }}
      >
        <Typography variant="caption" color="text.secondary" display="block">
          CP Range
        </Typography>
        <Typography variant="body2" fontWeight={600}>
          {boss.cp_range.max.toLocaleString()}
        </Typography>
      </Box>
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
          title="Raid Bosses"
          description="Current raid bosses available in Pokémon GO"
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
        CP ranges help you identify perfect IV catches. Weather boosted ranges
        indicate the Pokémon is level 25 instead of level 20.
      </Alert>

      {Object.entries(filteredData).map(([tier, bosses]) => {
        if (!bosses || bosses.length === 0) return null;

        return (
          <Box key={tier} sx={{ mb: 4 }}>
            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
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
            </Stack>

            {viewMode === 'grid' ? (
              <Grid container spacing={2}>
                {bosses.map((boss) => (
                  <Grid key={boss.name} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    {renderRaidBossCard(boss)}
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Stack spacing={1}>
                {bosses.map((boss) => renderRaidBossListItem(boss))}
              </Stack>
            )}
          </Box>
        );
      })}
    </Box>
  );
}

export default React.memo(RaidBossesPage);
