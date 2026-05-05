import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Dev server config — serves index.html with the widget mounted
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: false
  },
  build: {
    outDir: 'dist'
  }
});
