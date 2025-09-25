import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite'; // Corrected import for tailwindcss Vite plugin
import path from 'path';

export default defineConfig(() => {
  // Removed debugging console.logs

  return {
    plugins: [vue(), tailwindcss()], // Added tailwindcss plugin
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'), // 👈 this makes @ work
      },
    },
    define: {
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(
        process.env.VITE_GEMINI_API_KEY
      ),
      // --- DEBUGGING TEST VAR ---
      'import.meta.env.VITE_TEST_VAR': JSON.stringify(
        process.env.VITE_TEST_VAR
      ),
      // --- END DEBUGGING TEST VAR ---
    },
  };
});
