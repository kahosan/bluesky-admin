/// <reference types="vitest" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import unocss from 'unocss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  preview: {
    https: true
  },
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
  test: {},
  plugins: [react(), unocss()],
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});
