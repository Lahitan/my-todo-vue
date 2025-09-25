import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite'; // Corrected import for tailwindcss Vite plugin
import path from 'path';

export default defineConfig({
  plugins: [vue(), tailwindcss()], // Added tailwindcss plugin
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // 👈 this makes @ work
    },
  },
  define: {
    'process.env': {},
  },
});
