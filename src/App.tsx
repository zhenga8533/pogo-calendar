import { AppBar, Box, Container, CssBaseline, ThemeProvider, Toolbar, Typography } from "@mui/material";
import EventCalendar from "./components/calendar/EventCalendar";
import { theme } from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Pokémon GO Events
            </Typography>
          </Toolbar>
        </AppBar>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            backgroundColor: theme.palette.background.default,
            overflowY: "auto",
          }}
        >
          <Container maxWidth="xl">
            <EventCalendar />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
