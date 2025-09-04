import { Box, Container, CssBaseline, Typography } from "@mui/material";
import EventCalendar from "./components/calendar/EventCalendar";

function App() {
  return (
    <>
      <CssBaseline />
      <Container maxWidth="xl">
        <Box sx={{ my: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Pokémon GO Event Calendar
          </Typography>
          <EventCalendar />
        </Box>
      </Container>
    </>
  );
}

export default App;
