import MenuIcon from "@mui/icons-material/Menu";
import { Box, Button, CircularProgress, Drawer, useMediaQuery, useTheme } from "@mui/material";
import { useMemo, useState } from "react";
import { useEventData } from "../../hooks/useEventData";
import { useFilters } from "../../hooks/useFilters";
import { useSavedEvents } from "../../hooks/useSavedEvents";
import EventCalendar from "../calendar/EventCalendar";
import EventFilter from "../filters/EventFilter";

function CalendarView() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { allEvents, loading } = useEventData();
  const { savedEventIds, handleToggleSaveEvent } = useSavedEvents();
  const { filters, setFilters, handleResetFilters, filteredEvents } = useFilters(allEvents, savedEventIds);

  const allCategories = useMemo(() => {
    const categories = new Set(allEvents.map((event) => event.extendedProps.category));
    return Array.from(categories).sort();
  }, [allEvents]);

  const filterComponent = (
    <EventFilter
      filters={filters}
      onFilterChange={setFilters}
      onResetFilters={handleResetFilters}
      allCategories={allCategories}
    />
  );

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {isMobile ? (
        <>
          <Button variant="contained" startIcon={<MenuIcon />} onClick={() => setDrawerOpen(true)} sx={{ mb: 2 }}>
            Show Filters
          </Button>
          <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
            <Box sx={{ width: 300, p: 2 }}>{filterComponent}</Box>
          </Drawer>
        </>
      ) : (
        filterComponent
      )}
      <EventCalendar
        events={filteredEvents}
        isMobile={isMobile}
        savedEventIds={savedEventIds}
        onToggleSaveEvent={handleToggleSaveEvent}
      />
    </Box>
  );
}

export default CalendarView;
