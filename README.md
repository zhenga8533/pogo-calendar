# Pokémon GO Event Calendar

A responsive and feature-rich event calendar for Pokémon GO, built with React, TypeScript, and Material-UI. This application allows users to view, filter, and save upcoming in-game events to create a personalized schedule.

---

## Live Demo

You can view the live application here: https://zhenga8533.github.io/pogo-calendar

---

## Features

- **Interactive Calendar:** View events in a full calendar with Month, Week, Day, and List views, powered by FullCalendar.
- **Color-Coded Events:** Events are color-coded by their category for easy at-a-glance identification.
- **Comprehensive Filtering:**
  - **Search:** Instantly filter events by their title.
  - **Category:** Select one or more categories to display.
  - **Date Range:** Use date pickers to view events within a specific period.
  - **Time of Day:** Use a range slider to show events that start within certain hours of the day.
- **Save/Favorite Events:** Mark your favorite events with a star. A "Saved Events" filter allows you to see your personalized schedule.
- **Persistent State:** Your filter settings and saved events are automatically saved in your browser's `localStorage` for your next visit.
- **Fully Responsive:** A clean, mobile-friendly layout with a collapsible filter panel in a drawer for smaller screens.

---

## Tech Stack

- **Frontend:** React, TypeScript
- **UI Library:** Material-UI (MUI) v5
- **Calendar:** FullCalendar
- **State Management:** React Hooks (including custom hooks for logic separation)
- **Date Handling:** `date-fns` & `@mui/x-date-pickers`
- **Build Tool:** Vite

---

## Getting Started

### Prerequisites

Make sure you have Node.js (v18 or later) and npm installed on your machine.

### Installation

1.  Clone the repository to your local machine:
    ```bash
    git clone https://github.com/zhenga8533/pogo-calendar.git
    ```
2.  Navigate into the project directory:
    ```bash
    cd pogo-calendar
    ```
3.  Install the required dependencies:
    ```bash
    npm install
    ```

### Running the Development Server

To run the app locally, use the following command. This will start a development server, typically at `http://localhost:5173`.

```bash
npm run dev
```

---

## Deployment to GitHub Pages

To deploy this application to GitHub Pages, follow these steps:

1.  **Install `gh-pages`**
    Install the `gh-pages` package as a dev-dependency.

    ```bash
    npm install gh-pages --save-dev
    ```

2.  **Update `vite.config.ts`**
    Add a `base` property to your Vite configuration file, setting it to your repository name.

    ```ts
    import { defineConfig } from "vite";
    import react from "@vitejs/plugin-react";

    // https://vitejs.dev/config/
    export default defineConfig({
      plugins: [react()],
      base: "/pogo-calendar/",
    });
    ```

3.  **Update `package.json`**
    Add a `homepage` property and `predeploy`/`deploy` scripts to your `package.json` file.

    ```json
    {
      "name": "pogo-calendar",
      "homepage": "https://zhenga8533.github.io/pogo-calendar",
      "private": true,
      "version": "0.0.0",
      "type": "module",
      "scripts": {
        "dev": "vite",
        "build": "tsc && vite build",
        "predeploy": "npm run build",
        "deploy": "gh-pages -d dist",
        "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
        "preview": "vite preview"
      }
      // ... rest of the file
    }
    ```

4.  **Deploy the App**
    Run the deploy script from your terminal. This will build your application and push the contents of the `dist` folder to a new `gh-pages` branch on your repository.

    ```bash
    npm run deploy
    ```

5.  **Configure GitHub Repository**
    Finally, go to your repository's settings on GitHub. Under the "Pages" tab, set the source to deploy from the **`gh-pages`** branch. After a minute or two, your site will be live at the `homepage` URL you specified.

---

## Credits & Attribution

- The source code for the data scraper used to gather event information is available at [github.com/zhenga8533/leak-duck](https://github.com/zhenga8533/leak-duck).
- All event information is gratefully sourced from [LeekDuck.com](https://leekduck.com/events/).
