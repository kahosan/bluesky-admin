/// <reference types="vitest" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import unocss from 'unocss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/user/login': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  },
  plugins: [react(), unocss()],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  build: {
    rollupOptions: {
      manualChunks: (id) => {
        if (id.includes('node_modules')) {
          return id.split('node_modules/')[1].split('/')[1];
        }
      }
    }
  }
});
