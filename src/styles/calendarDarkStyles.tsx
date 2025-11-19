import { GlobalStyles, useTheme } from '@mui/material';

/**
 * Applies global styles to FullCalendar components to match MUI dark theme.
 *
 * @returns Global styles for FullCalendar to match MUI dark theme.
 */
export function CalendarDarkStyles() {
  const theme = useTheme();

  // Only apply styles in dark mode
  if (theme.palette.mode !== 'dark') {
    return null;
  }

  // Define global styles for FullCalendar components
  return (
    <GlobalStyles
      styles={{
        '.fc': {
          '--fc-border-color': theme.palette.divider,
          '--fc-day-other-bg-color': theme.palette.action.focus,
          '--fc-today-bg-color': 'rgba(144, 202, 249, 0.15)',
          '--fc-list-day-bg-color': theme.palette.action.hover,
          '--fc-list-day-side-bg-color': theme.palette.action.hover,
          '--fc-page-bg-color': theme.palette.background.default,
          '--fc-neutral-bg-color': theme.palette.background.paper,
        },
        '.fc .fc-col-header-cell': {
          backgroundColor: theme.palette.background.paper,
        },
        '.fc .fc-timegrid-axis': {
          backgroundColor: theme.palette.background.paper,
        },
        '.fc .fc-list-event:hover td': {
          backgroundColor: theme.palette.action.hover,
        },
        '.fc-event:hover, .event-highlight': {
          filter: 'brightness(1.3)',
          boxShadow: '0 0 8px rgba(0, 0, 0, 0.5)',
          zIndex: 10,
          position: 'relative',
        },
      }}
    />
  );
}
