import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
/// <reference types="vitest" />

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    // No proxy needed - using Supabase directly
  },
  build: {
    chunkSizeWarningLimit: 500, // Keep warning at reasonable size
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-react';
            }
            if (id.includes('@supabase')) {
              return 'vendor-supabase';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('@paypal') || id.includes('paypal')) {
              return 'vendor-paypal';
            }
            return 'vendor-other';
          }
          
          // App chunks
          if (id.includes('/pages/')) {
            const pageName = id.split('/pages/')[1].split('.')[0].toLowerCase();
            if (['home', 'pricing'].includes(pageName)) {
              return 'pages-main';
            }
            if (pageName.includes('admin') || pageName.includes('superadmin')) {
              return 'pages-admin';
            }
            if (pageName.includes('auth') || pageName.includes('signup')) {
              return 'pages-auth';
            }
            return 'pages-services';
          }
          
          if (id.includes('/components/')) {
            if (id.includes('admin') || id.includes('dashboard')) {
              return 'components-admin';
            }
            if (id.includes('auth') || id.includes('user')) {
              return 'components-auth';
            }
            return 'components-common';
          }
        }
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        'dist/'
      ]
    }
  }
});