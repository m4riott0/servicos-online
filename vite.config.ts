import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server:{
    open: true,
    proxy: {
      '/api': {
        target: 'https://apiapp2024.bensaude.com.br',
        changeOrigin: true,
        secure: false,
      },
    }
    
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
