import { createTheme, type PaletteMode } from '@mui/material';

export const getTheme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            // Light Mode Palette
            primary: {
              main: '#E53935', // Vibrant Red
            },
            background: {
              default: '#F8F9FA',
              paper: '#FFFFFF',
            },
          }
        : {
            // Dark Mode Palette
            primary: {
              main: '#EF5350', // Lighter Red for contrast
            },
            background: {
              default: '#121212', // Standard dark background
              paper: '#1E1E1E',
            },
          }),
    },
    components: {
      // Small tweaks for a more modern feel on components
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 16,
          },
        },
      },
    },
  });
