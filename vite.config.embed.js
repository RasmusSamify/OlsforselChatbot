import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Embed build — produces dist-embed/widget.js as a single self-contained
// IIFE bundle that auto-mounts on page load. CSS is imported via ?inline
// and injected into a <style> tag at runtime so customers only need one
// <script src="widget.js"></script> tag.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist-embed',
    emptyOutDir: true,
    cssCodeSplit: false,
    minify: 'esbuild',
    lib: {
      entry: 'src/embed.jsx',
      name: 'OlsforsWidget',
      fileName: () => 'widget.js',
      formats: ['iife']
    },
    rollupOptions: {
      output: {
        // Inline any CSS Vite emits as a separate asset (we also import via
        // ?inline in embed.jsx, but this is a safety net).
        inlineDynamicImports: true
      }
    }
  }
});
