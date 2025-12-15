// frontend/vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Importar o módulo path

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Configura o alias '@' para apontar para a pasta 'src'
      '@': path.resolve(__dirname, './src'),
    },
  },
});