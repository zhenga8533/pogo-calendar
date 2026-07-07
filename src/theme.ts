import { createTheme, type PaletteMode, type Shadows } from '@mui/material';

const FONT_STACK =
  '"Inter", "Roboto", "Helvetica", "Arial", sans-serif';

// Soft, layered shadows instead of MUI's harsh default umbra/penumbra stack.
const softShadows = (mode: PaletteMode): Shadows => {
  const alpha = mode === 'dark' ? 0.6 : 0.1;
  const base = mode === 'dark' ? '0,0,0' : '15,23,42';
  const levels = [
    'none',
    `0 1px 2px rgba(${base},${alpha * 0.6})`,
    `0 1px 3px rgba(${base},${alpha * 0.7}), 0 1px 2px rgba(${base},${alpha * 0.4})`,
    `0 2px 6px rgba(${base},${alpha * 0.7})`,
    `0 4px 10px rgba(${base},${alpha * 0.75})`,
    `0 6px 14px rgba(${base},${alpha * 0.75})`,
    `0 8px 18px rgba(${base},${alpha * 0.8})`,
    `0 10px 22px rgba(${base},${alpha * 0.8})`,
    `0 12px 26px rgba(${base},${alpha * 0.85})`,
  ];
  // MUI requires exactly 25 shadow entries; extend by reusing the deepest one.
  const filled = [
    ...levels,
    ...Array(25 - levels.length).fill(levels[levels.length - 1]),
  ];
  return filled as Shadows;
};

export const getTheme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            primary: { main: '#E0342A', light: '#EF5350', dark: '#B71C1C' },
            secondary: { main: '#2563EB', light: '#60A5FA', dark: '#1D4ED8' },
            background: { default: '#F6F7FB', paper: '#FFFFFF' },
            text: { primary: '#171923', secondary: '#5B6172' },
            divider: 'rgba(23, 25, 35, 0.08)',
          }
        : {
            primary: { main: '#EF5350', light: '#FF867C', dark: '#B61827' },
            secondary: { main: '#60A5FA', light: '#93C5FD', dark: '#2563EB' },
            background: { default: '#0E1015', paper: '#181B22' },
            text: { primary: '#F2F3F5', secondary: '#9AA0AE' },
            divider: 'rgba(255, 255, 255, 0.08)',
          }),
    },
    shape: {
      borderRadius: 8,
    },
    typography: {
      fontFamily: FONT_STACK,
      h1: { fontWeight: 800, letterSpacing: '-0.02em' },
      h2: { fontWeight: 800, letterSpacing: '-0.02em' },
      h3: { fontWeight: 700, letterSpacing: '-0.01em' },
      h4: { fontWeight: 700, letterSpacing: '-0.01em' },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 700 },
      subtitle1: { fontWeight: 600 },
      subtitle2: { fontWeight: 600 },
      button: { fontWeight: 600, textTransform: 'none' },
    },
    shadows: softShadows(mode),
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          '*': {
            scrollbarWidth: 'thin',
            scrollbarColor:
              mode === 'dark'
                ? 'rgba(255,255,255,0.18) transparent'
                : 'rgba(0,0,0,0.18) transparent',
          },
          '*::-webkit-scrollbar': { width: 8, height: 8 },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor:
              mode === 'dark' ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.18)',
            borderRadius: 8,
          },
          '*::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 600,
            transition:
              'background-color 150ms ease, box-shadow 150ms ease, transform 150ms ease',
          },
          contained: {
            '&:hover': { transform: 'translateY(-1px)' },
          },
          sizeLarge: { paddingTop: 10, paddingBottom: 10 },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            transition: 'background-color 150ms ease, transform 150ms ease',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            border: `1px solid ${
              mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.06)'
            }`,
            transition: 'box-shadow 150ms ease, transform 150ms ease',
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 12,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            fontWeight: 600,
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            borderRadius: 6,
            fontWeight: 500,
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiAppBar: {
        defaultProps: { elevation: 0 },
      },
    },
  });
