import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: { globals: globals.browser },
  },
  {
    // The service worker runs in a ServiceWorkerGlobalScope, not a window.
    files: ['public/sw.js'],
    languageOptions: {
      globals: {
        ...globals.serviceworker,
        // Defined by controller.sw.js, loaded via importScripts()
        $scramjetController: 'readonly',
      },
    },
  },
  // Last, so it switches off formatting rules from every config above.
  eslintConfigPrettier,
]);
