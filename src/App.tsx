import { Box, Container, CssBaseline, type PaletteMode, ThemeProvider, useMediaQuery } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import InfoDialog from "./components/shared/InfoDialog";
import Calendar from "./pages/Calendar";
import { CalendarDarkStyles } from "./styles/calendarDarkStyles";
import { getTheme } from "./theme";
import type { ThemeSetting } from "./types/theme";

/**
 * Main application component that sets up theming, layout, and state management.
 *
 * @returns The main application component that sets up theming, layout, and state management.
 */
function App() {
  const [infoOpen, setInfoOpen] = useState(false);

  // Theme management state and logic
  const [themeSetting, setThemeSetting] = useState<ThemeSetting>(() => {
    const savedMode = localStorage.getItem("themeMode") as ThemeSetting;
    return savedMode || "auto";
  });

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const mode: PaletteMode = useMemo(() => {
    if (themeSetting === "auto") {
      return prefersDarkMode ? "dark" : "light";
    }
    return themeSetting;
  }, [themeSetting, prefersDarkMode]);

  useEffect(() => {
    localStorage.setItem("themeMode", themeSetting);
  }, [themeSetting]);

  const theme = useMemo(() => getTheme(mode), [mode]);

  // Render the application with theming and layout
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CalendarDarkStyles />
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Header themeSetting={themeSetting} setThemeSetting={setThemeSetting} onInfoClick={() => setInfoOpen(true)} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            backgroundColor: theme.palette.background.default,
          }}
        >
          <Container maxWidth="xl">
            <Calendar />
          </Container>
        </Box>
        <Footer />
      </Box>

      <InfoDialog open={infoOpen} onClose={() => setInfoOpen(false)} />
    </ThemeProvider>
  );
}

export default App;
