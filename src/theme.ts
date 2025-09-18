import { createTheme, type PaletteMode } from "@mui/material";

export const getTheme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      ...(mode === "light"
        ? {
            // Light Mode Palette
            primary: {
              main: "#7E57C2", // Deep Purple
            },
            background: {
              default: "#F8F9FA", // Lighter, softer grey
              paper: "#FFFFFF",
            },
          }
        : {
            // Dark Mode Palette
            primary: {
              main: "#B39DDB", // Lighter Purple for contrast
            },
            background: {
              default: "#1A1A2E", // Dark Slate Blue
              paper: "#24243E", // Slightly lighter Slate Blue
            },
          }),
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: "none",
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
