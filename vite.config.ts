import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/pogo-calendar',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],

          // Material-UI and Emotion components
          'mui-core': [
            '@mui/material',
            '@mui/system',
            '@emotion/react',
            '@emotion/styled',
          ],
          'mui-icons': ['@mui/icons-material'],
          'mui-pickers': ['@mui/x-date-pickers'],

          // FullCalendar
          'fullcalendar-core': ['@fullcalendar/core', '@fullcalendar/react'],
          'fullcalendar-plugins': [
            '@fullcalendar/daygrid',
            '@fullcalendar/timegrid',
            '@fullcalendar/list',
            '@fullcalendar/interaction',
          ],

          // Date utilities
          'date-utils': ['date-fns', 'date-fns-tz'],

          // Other utilities
          utils: ['ics', 'uuid'],
        },
      },
    },
    // Increase chunk size warning limit to 1000 kB (default is 500 kB)
    chunkSizeWarningLimit: 1000,
  },
});
