import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // ✅ React frontend 
    proxy: {
      '/api': {
        target: 'https://localhost:44396', // ✅ .NET backend
        changeOrigin: true,
        secure: false, // Accept self-signed certs in dev
      },
    },
  },
});
