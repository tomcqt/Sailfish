import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import pkg from './package.json' with { type: 'json' };

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Compile-time constant, makes it so that the version shows in the UI
    // without importing package.json into the browsers bundle.
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
});
