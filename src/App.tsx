import InfoIcon from "@mui/icons-material/Info";
import { AppBar, Box, Container, CssBaseline, IconButton, ThemeProvider, Toolbar, Typography } from "@mui/material";
import { useState } from "react";
import InfoDialog from "./components/info/InfoDialog";
import CalendarView from "./components/views/CalendarView";
import { theme } from "./theme";

/**
 * Main App component rendering the Pokémon GO Calendar application.
 *
 * @returns The main App component rendering the Pokémon GO Calendar application.
 */
function App() {
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Pokémon GO Calendar
            </Typography>
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
