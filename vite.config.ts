import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/pogo-calendar',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],

          // Radix UI primitives
          'radix-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-popover',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-accordion',
            '@radix-ui/react-tabs',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-switch',
            '@radix-ui/react-slider',
            '@radix-ui/react-toggle-group',
            '@radix-ui/react-select',
            '@radix-ui/react-toast',
            '@radix-ui/react-hover-card',
            '@radix-ui/react-label',
            '@radix-ui/react-separator',
            '@radix-ui/react-slot',
          ],
          icons: ['lucide-react'],
          pickers: ['react-day-picker', 'cmdk'],

          // FullCalendar
          'fullcalendar-core': ['@fullcalendar/core', '@fullcalendar/react'],
          'fullcalendar-plugins': [
            '@fullcalendar/daygrid',
            '@fullcalendar/list',
            '@fullcalendar/interaction',
          ],

          // Date utilities
          'date-utils': ['date-fns'],

          // Other utilities
          utils: ['ics', 'uuid'],
        },
      },
    },
    // Increase chunk size warning limit to 1000 kB (default is 500 kB)
    chunkSizeWarningLimit: 1000,
  },
});
