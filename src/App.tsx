import { Box, Container, CssBaseline, ThemeProvider } from "@mui/material";
import { useCallback, useState } from "react";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import InfoDialog from "./components/shared/InfoDialog";
import { SettingsDialog } from "./components/shared/SettingsDialog";
import { useSettings } from "./hooks/useSettings";
import Calendar from "./pages/Calendar";
import { CalendarDarkStyles } from "./styles/calendarDarkStyles";
import type { Settings } from "./types/settings";

/**
 * The main application component that sets up theming, layout, and state management.
 *
 * @returns The main application component.
 */
function App() {
  const [infoOpen, setInfoOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { theme, settings, setSettings } = useSettings();
  const handleInfoOpen = useCallback(() => setInfoOpen(true), []);
  const handleInfoClose = useCallback(() => setInfoOpen(false), []);
  const handleSettingsOpen = useCallback(() => setSettingsOpen(true), []);
  const handleSettingsClose = useCallback(() => setSettingsOpen(false), []);

  const handleSettingsChange = useCallback(
    (newSettings: Partial<Settings>) => {
      setSettings((prev) => ({ ...prev, ...newSettings }));
    },
    [setSettings]
  );

  // Render the application with theming and layout.
  return (
    <ThemeProvider theme={theme}>
      {/* Normalize CSS across browsers */}
      <CssBaseline />
      <CalendarDarkStyles />

      {/* Main layout container */}
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Header onInfoClick={handleInfoOpen} onSettingsClick={handleSettingsOpen} />
        <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: "background.default" }}>
          <Container maxWidth="xl">
            <Calendar settings={settings} />
          </Container>
        </Box>
        <Footer />
      </Box>

      {/* Info and Settings dialogs */}
      <InfoDialog open={infoOpen} onClose={handleInfoClose} />
      <SettingsDialog
        open={settingsOpen}
        onClose={handleSettingsClose}
        settings={settings}
        onSettingsChange={handleSettingsChange}
      />
    </ThemeProvider>
  );
}

export default App;
