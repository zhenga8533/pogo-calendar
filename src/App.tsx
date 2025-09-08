import { Box, Container, CssBaseline, type PaletteMode, ThemeProvider } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import InfoDialog from "./components/shared/InfoDialog";
import CalendarView from "./pages/CalendarView";
import { CalendarDarkStyles } from "./styles/calendarDarkStyles";
import { getTheme } from "./theme";

/**
 * Main application component that sets up theming, layout, and state management.
 *
 * @returns The main application component that sets up theming, layout, and state management.
 */
function App() {
  const [infoOpen, setInfoOpen] = useState(false);
  const [mode, setMode] = useState<PaletteMode>(() => {
    const savedMode = localStorage.getItem("themeMode");
    return savedMode === "light" || savedMode === "dark" ? savedMode : "light";
  });

  // Persist theme mode to localStorage
  useEffect(() => {
    localStorage.setItem("themeMode", mode);
  }, [mode]);

  const theme = useMemo(() => getTheme(mode), [mode]);

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  // Render the application with theming and layout
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CalendarDarkStyles />
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Header onToggleTheme={toggleColorMode} onInfoClick={() => setInfoOpen(true)} mode={mode} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            backgroundColor: theme.palette.background.default,
          }}
        >
          <Container maxWidth="xl">
            <CalendarView />
          </Container>
        </Box>
        <Footer />
      </Box>

      <InfoDialog open={infoOpen} onClose={() => setInfoOpen(false)} />
    </ThemeProvider>
  );
}

export default App;
