import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import InfoIcon from "@mui/icons-material/Info";
import {
  AppBar,
  Box,
  Container,
  CssBaseline,
  IconButton,
  type PaletteMode,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import InfoDialog from "./components/info/InfoDialog";
import CalendarView from "./components/views/CalendarView";
import { CalendarDarkStyles } from "./styles/calendarDarkStyles";
import { getTheme } from "./theme";

/**
 * Main App component rendering the Pokémon GO Calendar application.
 *
 * @returns The main App component rendering the Pokémon GO Calendar application.
 */
function App() {
  const [infoOpen, setInfoOpen] = useState(false);
  const [mode, setMode] = useState<PaletteMode>(() => {
    const savedMode = localStorage.getItem("themeMode");
    return savedMode === "light" || savedMode === "dark" ? savedMode : "light";
  });

  useEffect(() => {
    localStorage.setItem("themeMode", mode);
  }, [mode]);

  const theme = useMemo(() => getTheme(mode), [mode]);

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CalendarDarkStyles />
      <Box>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Pokémon GO Calendar
            </Typography>
            <IconButton sx={{ ml: 1 }} onClick={toggleColorMode} color="inherit">
              {theme.palette.mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            <IconButton color="inherit" onClick={() => setInfoOpen(true)}>
              <InfoIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box
          component="main"
          sx={{
            p: 3,
            backgroundColor: theme.palette.background.default,
          }}
        >
          <Container maxWidth="xl">
            <CalendarView />
          </Container>
        </Box>
      </Box>

      <InfoDialog open={infoOpen} onClose={() => setInfoOpen(false)} />
    </ThemeProvider>
  );
}

export default App;
