// vite.config.js (ESM)
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@backend': path.resolve(import.meta.dirname, 'src/backend'),
      '@frontend': path.resolve(import.meta.dirname, 'src/frontend'),
      '@assets': path.resolve(import.meta.dirname, 'src/assets'),
      '@utils': path.resolve(import.meta.dirname, 'src/utils'),
    },
  },
});