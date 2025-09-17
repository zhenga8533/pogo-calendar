import { Alert, Box, Container, CssBaseline, Snackbar, ThemeProvider } from "@mui/material";
import { useCallback, useRef, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import { SettingsDialog } from "./components/shared/SettingsDialog";
import { useSettings } from "./hooks/useSettings";
import Calendar from "./pages/Calendar";
import FaqPage from "./pages/Faq";
import { CalendarDarkStyles } from "./styles/calendarDarkStyles";
import type { Settings } from "./types/settings";

/**
 * The main application component that sets up theming, layout, and state management.
 *
 * @returns The main application component.
 */
function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { theme, settings, setSettings } = useSettings();
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({ open: false, message: "", severity: "success" });

  const refetchEventsRef = useRef<() => Promise<void>>(() => Promise.resolve());
  const refetchLastUpdatedRef = useRef<() => Promise<void>>(() => Promise.resolve());

  const handleSettingsOpen = useCallback(() => setSettingsOpen(true), []);
  const handleSettingsClose = useCallback(() => setSettingsOpen(false), []);

  const handleSettingsChange = useCallback(
    (newSettings: Partial<Settings>) => {
      setSettings((prev) => ({ ...prev, ...newSettings }));
    },
    [setSettings]
  );

  const setRefetchEvents = useCallback((refetch: () => Promise<void>) => {
    refetchEventsRef.current = refetch;
  }, []);

  const setRefetchLastUpdated = useCallback((refetch: () => Promise<void>) => {
    refetchLastUpdatedRef.current = refetch;
  }, []);

  const handleRefresh = useCallback(async () => {
    try {
      await Promise.all([refetchEventsRef.current(), refetchLastUpdatedRef.current()]);
      setToast({ open: true, message: "Data refreshed successfully!", severity: "success" });
    } catch (error) {
      setToast({ open: true, message: "Failed to refresh data.", severity: "error" });
    }
  }, []);

  const handleCloseToast = useCallback(() => {
    setToast((prev) => ({ ...prev, open: false }));
  }, []);

  // Render the application with theming and layout.
  return (
    <ThemeProvider theme={theme}>
      {/* Normalize CSS across browsers */}
      <CssBaseline />
      <CalendarDarkStyles />

      {/* Main layout container */}
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Header
          onSettingsClick={handleSettingsOpen}
          onRefresh={handleRefresh}
          setRefetchLastUpdated={setRefetchLastUpdated}
        />
        <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: "background.default" }}>
          <Routes>
            <Route
              path="/"
              element={
                <Container maxWidth="xl">
                  <Calendar settings={settings} setRefetchEvents={setRefetchEvents} toast={toast} setToast={setToast} />
                </Container>
              }
            />
            <Route path="/faq" element={<FaqPage />} />
          </Routes>
        </Box>
        <Footer />
      </Box>

      {/* Info and Settings dialogs */}
      <SettingsDialog
        open={settingsOpen}
        onClose={handleSettingsClose}
        settings={settings}
        onSettingsChange={handleSettingsChange}
      />
      <Snackbar open={toast.open} autoHideDuration={6000} onClose={handleCloseToast}>
        <Alert onClose={handleCloseToast} severity={toast.severity} sx={{ width: "100%" }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;
