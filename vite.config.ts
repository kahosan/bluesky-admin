/// <reference types="vitest" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import unocss from 'unocss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  test: {},
  plugins: [react(), unocss()],
  base: './',
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
