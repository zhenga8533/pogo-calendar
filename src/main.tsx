import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { CalendarProvider } from "./contexts/CalendarContext.tsx";
import { SettingsProvider } from "./contexts/SettingsContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename="/pogo-calendar">
      <SettingsProvider>
        <CalendarProvider>
          <App />
        </CalendarProvider>
      </SettingsProvider>
    </BrowserRouter>
  </StrictMode>
);
