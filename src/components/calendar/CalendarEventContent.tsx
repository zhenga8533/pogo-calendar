import type { EventContentArg } from '@fullcalendar/core';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { Box, IconButton, Typography, alpha, useTheme } from '@mui/material';
import React from 'react';
import type { CalendarEvent } from '../../types/events';
import { getColorForCategory } from '../../utils/colorUtils';

interface CalendarEventContentProps {
  eventInfo: EventContentArg;
  isSaved: boolean;
  onToggleSave: (eventId: string) => void;
  onMouseEnter: (
    e: React.MouseEvent<HTMLElement>,
    event: CalendarEvent
  ) => void;
  onMouseLeave: () => void;
}

export const CalendarEventContent = React.memo(function CalendarEventContent({
  eventInfo,
  isSaved,
  onToggleSave,
  onMouseEnter,
  onMouseLeave,
}: CalendarEventContentProps) {
  const theme = useTheme();
  const { category, article_url } = eventInfo.event.extendedProps;
  const baseColor = getColorForCategory(category, theme.palette.mode);

  return (
    <Box
      sx={{
        backgroundColor: alpha(baseColor, 0.15),
        borderLeft: `4px solid ${baseColor}`,
        color: theme.palette.text.primary,
        borderRadius: '4px',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        boxSizing: 'border-box',
        transition: 'all 0.2s ease',
        px: 0.5,
        '&:hover': {
          backgroundColor: alpha(baseColor, 0.25),
          transform: 'translateY(-1px)',
        },
      }}
      onMouseEnter={(e) =>
        onMouseEnter(e, eventInfo.event as unknown as CalendarEvent)
      }
      onMouseLeave={onMouseLeave}
    >
      <Box
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          display: 'flex',
          gap: 0.5,
          alignItems: 'center',
        }}
      >
        <Typography
          variant="caption"
          fontWeight={700}
          sx={{ opacity: 0.8, minWidth: 'fit-content' }}
        >
          {eventInfo.timeText}
        </Typography>
        <Typography variant="caption" noWrap fontWeight={500}>
          {eventInfo.event.title}
        </Typography>
      </Box>

      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          onToggleSave(article_url);
        }}
        sx={{
          color: theme.palette.text.secondary,
          p: 0.25,
          '&:hover': { color: theme.palette.primary.main },
        }}
      >
        {isSaved ? (
          <StarIcon fontSize="inherit" color="warning" />
        ) : (
          <StarBorderIcon fontSize="inherit" />
        )}
      </IconButton>
    </Box>
  );
});
