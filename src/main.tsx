import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { CalendarProvider } from './contexts/CalendarProvider.tsx';
import { SettingsProvider } from './contexts/SettingsProvider.tsx';
import './index.css';
import './styles/calendar.css';

createRoot(document.getElementById('root')!).render(
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
