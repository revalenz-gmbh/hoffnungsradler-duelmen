import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api/voting': {
        target: 'https://script.google.com/macros/s/AKfycbw6T6Nmx0L_72v5n9a-Z5etbXlA4s2-yVFLBwKllGshcg26W2R1-e2Lq8BtTqU2kE3wJQ',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/voting/, '/exec'),
      },
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
