import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite'; // Corrected import for tailwindcss Vite plugin
import path from 'path';

export default defineConfig(({ mode }) => {
  // --- DEBUGGING START ---
  console.log('Vite Config: process.env at start:', process.env);
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  console.log('Vite Config: loadEnv result (VITE_ prefix):', env);
  // --- DEBUGGING END ---

  return {
    plugins: [vue(), tailwindcss()], // Added tailwindcss plugin
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'), // 👈 this makes @ work
      },
    },
    define: {
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(
        env.VITE_GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY // Fallback to process.env
      ),
    },
  };
});
