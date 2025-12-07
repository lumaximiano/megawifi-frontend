// vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
    host: true,
  },
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './source' ),
      '@components': path.resolve(__dirname, './source/portals/master/components'),
      '@pages': path.resolve(__dirname, './source/portals/master/pages'),
      '@css': path.resolve(__dirname, './source/portals/master/css'),
      '@styles': path.resolve(__dirname, './source/styles'),
      '@api': path.resolve(__dirname, './source/api'),
      '@global-pages': path.resolve(__dirname, './source/pages'),
    },
  },
  
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        hotspot: path.resolve(__dirname, 'public/hotspot.html')
      }
    }
  }
});
