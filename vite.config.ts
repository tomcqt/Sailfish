/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import pkg from './package.json' with { type: 'json' };
import { wispDevPlugin } from './vite/wisp-dev-plugin.ts';

const scramjetDist = 'node_modules/@mercuryworkshop/scramjet/dist';
const controllerDist = 'node_modules/@mercuryworkshop/scramjet-controller/dist';

export default defineConfig({
  plugins: [
    react(),
    wispDevPlugin(),
    viteStaticCopy({
      // v4 keeps the source's directory structure under `dest` by default
      // (e.g. /scramjet/node_modules/.../scramjet.js). stripBase flattens each
      // file directly into `dest`, so it is served at /scramjet/scramjet.js.
      targets: [
        { src: `${scramjetDist}/scramjet.js`, dest: 'scramjet' },
        { src: `${scramjetDist}/scramjet.wasm`, dest: 'scramjet' },
        { src: `${controllerDist}/controller.api.js`, dest: 'controller' },
        { src: `${controllerDist}/controller.sw.js`, dest: 'controller' },
        { src: `${controllerDist}/controller.inject.js`, dest: 'controller' },
      ].map((target) => ({ ...target, rename: { stripBase: true } })),
    }),
  ],
  define: {
    // Compile-time constant, makes it so that the version shows in the UI
    // without importing package.json into the browsers bundle.
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  resolve: {
    alias: {
      // Mirrors the "paths" entry in tsconfig.app.json. Both must agree, or
      // the editor and the bundler resolve imports differently.
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'server/**/*.test.ts'],
    css: false,
  },
});
