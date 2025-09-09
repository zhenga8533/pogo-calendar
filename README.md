# Pokémon GO Event Calendar

A comprehensive and polished single-page application for tracking Pokémon GO events. This project was built from the ground up, evolving from a simple data display into a full-featured, interactive calendar with advanced filtering, custom event management, and a modern, responsive user interface.

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

### Advanced Filtering

- **Multi-faceted Filtering:** Filter events by search term, date range, and a specific time-of-day range using a slider.
- **Optimized Category Filter:** A modern pop-up menu for category selection with grouping, color keys, "Select All," and "Clear All" actions.
- **Integrated "Saved" Filter:** Filter by your saved events directly from the category menu.
- **View-Specific Filters:** Each calendar view (Month, Week, Day, List) remembers its own unique filter settings.

### Polished User Experience

- **Persistent State:** All filters and user data (saved & custom events) are saved in the browser's `localStorage`.
- **Fully Responsive:** A clean, mobile-friendly layout with a collapsible filter drawer.
- **Skeleton Loaders:** A modern skeleton screen is shown during the initial data fetch for improved perceived performance.
- **Empty State:** A user-friendly message appears when filters result in no events.
- **Toast Notifications:** Clear feedback is provided for actions like creating and deleting events.

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
├── App.tsx
├── pages/
│   └── CalendarView.tsx
├── components/
│   ├── calendar/
│   ├── events/
│   ├── filters/
│   ├── info/
│   └── layout/
├── config/
├── hooks/
├── services/
├── styles/
├── types/
└── utils/
```

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
      base: "/pogo-calendar/",
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
