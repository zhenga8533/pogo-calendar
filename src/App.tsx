import { Box, Container, CssBaseline, ThemeProvider } from "@mui/material";
import { useCallback, useState } from "react";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import InfoDialog from "./components/shared/InfoDialog";
import { useAppTheme } from "./hooks/useAppTheme";
import { useSettings } from "./hooks/useSettings";
import Calendar from "./pages/Calendar";
import { CalendarDarkStyles } from "./styles/calendarDarkStyles";

/**
 * The main application component that sets up theming, layout, and state management.
 *
 * @returns The main application component.
 */
function App() {
  const [infoOpen, setInfoOpen] = useState(false);

  const { settings, handleSettingChange } = useSettings();
  const { theme } = useAppTheme(settings.theme);

  const handleInfoOpen = useCallback(() => setInfoOpen(true), []);
  const handleInfoClose = useCallback(() => setInfoOpen(false), []);

  // Render the application with theming and layout.
  return (
    <ThemeProvider theme={theme}>
      {/* Normalize CSS across browsers */}
      <CssBaseline />
      <CalendarDarkStyles />

      {/* Main layout container */}
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Header settings={settings} onSettingChange={handleSettingChange} onInfoClick={handleInfoOpen} />
        <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: "background.default" }}>
          <Container maxWidth="xl">
            <Calendar settings={settings} />
          </Container>
        </Box>
        <Footer />
      </Box>

      {/* Info dialog */}
      <InfoDialog open={infoOpen} onClose={handleInfoClose} />
    </ThemeProvider>
  );
}

export default App;
