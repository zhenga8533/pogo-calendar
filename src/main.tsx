import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { SettingsProvider } from "./contexts/SettingsContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename="/pogo-calendar">
      <SettingsProvider>
        <App />
      </SettingsProvider>
    </BrowserRouter>
  </StrictMode>
);
