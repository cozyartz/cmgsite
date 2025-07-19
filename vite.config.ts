import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://cmgsite-client-portal.cozyartz-media-group.workers.dev', // Production Cloudflare Worker
        changeOrigin: true,
        secure: true,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 800, // Increase limit to 800 kB
    rollupOptions: {
      // Remove multiple entry points - we're building a SPA
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['lucide-react', 'react-helmet-async'],
          auth: ['@supabase/supabase-js']
        }
      }
    }
  }
});