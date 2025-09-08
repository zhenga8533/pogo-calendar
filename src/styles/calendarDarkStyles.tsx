import { GlobalStyles, useTheme } from "@mui/material";

/**
 * Applies global styles to FullCalendar components to match MUI dark theme.
 *
 * @returns Global styles for FullCalendar to match MUI dark theme.
 */
export function CalendarDarkStyles() {
  const theme = useTheme();

  // Only apply styles in dark mode
  if (theme.palette.mode !== "dark") {
    return null;
  }

  // Define global styles for FullCalendar components
  return (
    <GlobalStyles
      styles={{
        ".fc": {
          "--fc-border-color": theme.palette.divider,
          "--fc-day-other-bg-color": theme.palette.action.focus,
          "--fc-today-bg-color": "rgba(144, 202, 249, 0.15)",
          "--fc-list-day-bg-color": theme.palette.action.hover,
          "--fc-list-day-side-bg-color": theme.palette.action.hover,
          "--fc-page-bg-color": theme.palette.background.default,
          "--fc-neutral-bg-color": theme.palette.background.paper,
        },
        ".fc .fc-button-primary": {
          backgroundColor: theme.palette.primary.main,
          borderColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        },
        ".fc .fc-button-primary:hover": {
          backgroundColor: theme.palette.primary.dark,
          borderColor: theme.palette.primary.dark,
        },
        ".fc .fc-col-header-cell": {
          backgroundColor: theme.palette.background.paper,
        },
        ".fc .fc-timegrid-axis": {
          backgroundColor: theme.palette.background.paper,
        },
        ".fc .fc-list-day-cushion.fc-cell-shaded": {
          backgroundColor: `${theme.palette.background.paper} !important`,
        },
        ".fc .fc-col-header-cell-cushion": {
          color: theme.palette.text.secondary,
        },
        ".fc .fc-list-day-text": {
          color: theme.palette.text.primary,
        },
        ".fc .fc-list-day-side-text": {
          color: theme.palette.text.secondary,
        },
        ".fc .fc-list-event:hover td": {
          backgroundColor: theme.palette.action.hover,
        },
      }}
    />
  );
}
