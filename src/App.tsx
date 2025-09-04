import { AppBar, Box, Container, CssBaseline, ThemeProvider, Toolbar, Typography } from "@mui/material";
import CalendarView from "./components/views/CalendarView";
import { theme } from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box>
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
            p: 3,
            backgroundColor: theme.palette.background.default,
          }}
        >
          <Container maxWidth="xl">
            <CalendarView />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
