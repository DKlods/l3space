import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.API_URL || 'http://localhost:8000/api/v1'),
    'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(process.env.GEMINI_API_KEY),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  }
});
