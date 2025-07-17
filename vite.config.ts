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
        target: 'http://localhost:8787', // Local Cloudflare Worker (run with: npm run worker:dev)
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        'ai-services': './ai-services.html',
        'seo-services': './seo-services.html', 
        'instructional-design-services': './instructional-design-services.html',
        'multimedia-services': './multimedia-services.html',
        'drone-services': './drone-services.html',
        'web-graphic-design-services': './web-graphic-design-services.html',
        'pricing': './pricing.html'
      }
    }
  }
});
