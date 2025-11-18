# Pokémon GO Event Calendar

A comprehensive React application for tracking Pokémon GO events and game data. This project evolved from a simple calendar display into a full-featured platform with interactive calendar views, data reference pages, advanced filtering, custom event management, and a modern, responsive user interface.

---

## Live Demo

You can view the live application here: `https://zhenga8533.github.io/pogo-calendar`

---

## Features

### Dynamic Calendar & Theming

- **Multiple Views:** View events in a full calendar with Month, Week, Day, and List views, powered by FullCalendar.
- **Light & Dark Modes:** A theme toggle with persistence in `localStorage`.
- **Custom Dark Mode Theming:** Thoroughly styled dark mode that covers all aspects of the calendar, including headers and pop-ups.
- **Responsive Header:** A modern "glassmorphism" header that becomes opaque on scroll and adapts its layout for mobile.

### Event Management

- **Color-Coded Events:** Events are colored by category, with dynamically generated colors for any new, unknown categories.
- **Save/Favorite Events:** Mark events as "saved" with a star icon, both on the event and in the details pop-up.
- **Custom Events:** Full CRUD (Create, Read, Update, Delete) functionality for user-created events.
- **"Add to Calendar":** Export any event to a universal `.ics` file that can be imported into Google Calendar, Apple Calendar, Outlook, etc.

### Data Reference Pages

- **Egg Pool:** Browse current egg hatches by tier (2km, 5km, 7km, 10km, 12km) with regional availability filters.
- **Raid Bosses:** View active raid bosses by tier (1-star through Mega) with CP ranges, shiny availability, and move filters.
- **Research Tasks:** Search research tasks by rewards (Pokemon, items, Stardust, XP, etc.) and track shiny availability.
- **Rocket Lineup:** View current Team GO Rocket encounters by grunt type, leader, or Giovanni, with shiny tracking.

### Advanced Filtering

- **Calendar Filters:** Filter events by search term, date range, time-of-day range, and category with view-specific settings.
- **Page-Specific Filters:** Each data page has tailored filters (tiers, types, shiny status, regions, etc.) with search and bulk selection.
- **Optimized Category Filter:** Modern pop-up menu for category selection with grouping, color keys, "Select All," and "Clear All" actions.
- **Integrated "Saved" Filter:** Filter by your saved events directly from the category menu.
- **Persistent State:** All filter settings are preserved in `localStorage`.

### Polished User Experience

- **Fully Responsive:** Clean, mobile-friendly layout with collapsible filter drawers across all pages.
- **Skeleton Loaders:** Modern skeleton screens shown during data fetching for improved perceived performance.
- **Error Handling:** Graceful error displays with retry functionality when data fails to load.
- **Empty States:** User-friendly messages when filters result in no content.
- **Toast Notifications:** Clear feedback for actions like creating and deleting events.

---

## Tech Stack

- **Frontend:** React, TypeScript
- **UI Library:** Material-UI (MUI) v5
- **Calendar:** FullCalendar
- **State Management:** React Hooks (including custom hooks for logic separation)
- **Date Handling:** `date-fns` & `@mui/x-date-pickers`
- **Client-Side Storage:** `localStorage`
- **Utilities:** `uuid` (for unique IDs), `ics` (for calendar file generation)
- **Build Tool:** Vite

---

## Project Structure

The project is organized into a clean, scalable structure that separates concerns:

```
src/
├── App.tsx               # Main application component with routing
├── main.tsx              # Application entry point
├── theme.ts              # MUI theme configuration
├── vite-env.d.ts         # Vite environment type definitions
├── assets/images/        # Static images
│   └── default-banner.jpg
├── components/
│   ├── calendar/         # Calendar-specific components
│   │   ├── EventCalendar.tsx
│   │   ├── CalendarEventContent.tsx
│   │   └── CalendarSkeleton.tsx
│   ├── events/           # Event management components
│   │   ├── CreateEventDialog.tsx
│   │   ├── EventDetailDialog.tsx
│   │   ├── EventHoverDetails.tsx
│   │   ├── ExportEventDialog.tsx
│   │   ├── CategoryExportPanel.tsx
│   │   └── SpecificEventExportPanel.tsx
│   ├── filters/          # Filter components
│   │   ├── shared/       # Shared filter components
│   │   │   ├── FilterSection.tsx
│   │   │   ├── FilterActions.tsx
│   │   │   ├── ShinyChip.tsx
│   │   │   ├── BaseFilterCard.tsx
│   │   │   └── index.ts
│   │   ├── AdvancedFilter.tsx
│   │   ├── EventFilter.tsx
│   │   ├── ColorKeyLabel.tsx
│   │   ├── EggPoolFilter.tsx
│   │   ├── RaidBossFilter.tsx
│   │   ├── ResearchTaskFilter.tsx
│   │   └── RocketLineupFilter.tsx
│   ├── layout/           # Layout components
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   └── shared/           # Reusable UI components
│       ├── CategoryTag.tsx
│       ├── ErrorBoundary.tsx
│       ├── DataLoadingSkeleton.tsx
│       ├── DataErrorDisplay.tsx
│       ├── PageHeader.tsx
│       ├── EventStatusTag.tsx
│       ├── PageLoader.tsx
│       ├── NextEventTracker.tsx
│       ├── ScrollToTop.tsx
│       ├── SettingsDialog.tsx
│       ├── DeleteConfirmationDialog.tsx
│       └── UnsavedChangesDialog.tsx
├── config/               # Configuration files
│   ├── api.ts
│   ├── constants.ts
│   ├── eventFilter.ts
│   ├── colorMapping.ts
│   ├── timeConstants.ts
│   └── routes.ts
├── contexts/             # React contexts for state management
│   ├── CalendarContext.tsx
│   ├── EventDataContext.tsx
│   ├── FilterContext.tsx
│   ├── CustomEventsContext.tsx
│   └── SettingsContext.tsx
├── hooks/                # Custom React hooks
│   ├── useEventData.ts
│   ├── useFilters.ts
│   ├── usePageData.ts
│   ├── usePageFilters.ts
│   ├── useSavedEvents.ts
│   ├── useCustomEvents.ts
│   ├── useEventNotes.ts
│   ├── useEventStatus.ts
│   ├── useNextUpcomingEvent.ts
│   ├── useLastUpdated.ts
│   ├── useDialogs.ts
│   ├── useToast.ts
│   └── useNoteEditor.ts
├── pages/                # Page components (lazy-loaded)
│   ├── Calendar.tsx
│   ├── EggPool.tsx
│   ├── RaidBosses.tsx
│   ├── ResearchTasks.tsx
│   ├── RocketLineup.tsx
│   └── Faq.tsx
├── services/             # API services
│   ├── eventService.ts   # Calendar event fetching
│   └── dataService.ts    # Game data fetching
├── styles/               # Global styles
│   └── calendarDarkStyles.tsx
├── types/                # TypeScript definitions
│   ├── events.ts
│   ├── filters.ts
│   ├── pageFilters.ts
│   ├── settings.ts
│   ├── eggPool.ts
│   ├── raidBosses.ts
│   ├── researchTasks.ts
│   └── rocketLineup.ts
└── utils/                # Utility functions
    ├── colorUtils.ts
    ├── dateUtils.ts
    ├── storageUtils.ts
    └── calendarUtils.ts
```

### Architecture Patterns

- **Context-based State Management:** Separate contexts for calendar, events, filters, and settings
- **Custom Hooks:** Business logic separated into reusable hooks
- **Lazy Loading:** Page components are lazy-loaded for better performance
- **Centralized Services:** API calls abstracted into service modules
- **Type Safety:** Full TypeScript coverage with comprehensive type definitions

---

## Getting Started

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/zhenga8533/pogo-calendar.git
    ```
2.  Navigate into the project directory:
    ```bash
    cd pogo-calendar
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```

### Running the Development Server

```bash
npm run dev
```

---

## Deployment to GitHub Pages

1.  **Install `gh-pages`**:
    ```bash
    npm install gh-pages --save-dev
    ```
2.  **Update `vite.config.ts`**: Add the `base` property.
    ```ts
    export default defineConfig({
      plugins: [react()],
      base: '/pogo-calendar/',
    });
    ```
3.  **Update `package.json`**: Add a `homepage` URL and `deploy` scripts.
    ```json
    {
      "name": "pogo-calendar",
      "homepage": "https://zhenga8533.github.io/pogo-calendar",
      "scripts": {
        "predeploy": "npm run build",
        "deploy": "gh-pages -d dist"
      }
    }
    ```
4.  **Run the deploy script**:
    ```bash
    npm run deploy
    ```
5.  **Configure GitHub:** In your repository's **Settings \> Pages**, set the source to deploy from the **`gh-pages`** branch.

---

## Credits & Attribution

- The source code for the data scraper is available at [github.com/zhenga8533/leak-duck](https://github.com/zhenga8533/leak-duck).
- All event information is gratefully sourced from [LeekDuck.com](https://leekduck.com/events/).
