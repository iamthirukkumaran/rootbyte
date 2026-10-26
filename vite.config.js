import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  // Relative, so one build works at a domain root and under /repo/ on Pages
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        privacy: resolve(__dirname, 'privacy-policy.html'),
        terms: resolve(__dirname, 'terms-of-service.html'),
        cookies: resolve(__dirname, 'cookie-policy.html'),
      },
    },
  },
});
