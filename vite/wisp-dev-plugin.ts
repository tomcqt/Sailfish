import type { Plugin } from 'vite';
import { configureWisp, handleWispUpgrade } from '../server/wisp';

/**
 * Lets `pnpm dev` proxy sites without running the Fastify server too. Vite's
 * own HMR WebSocket shares the same HTTP server, & handleWispUpgrade ignores
 * any path except /wisp/, so HMR keeps working.
 */
export function wispDevPlugin(): Plugin {
  return {
    name: 'sailfish:wisp-dev',
    apply: 'serve',
    configureServer(server) {
      configureWisp();
      server.httpServer?.on('upgrade', (req, socket, head) => {
        handleWispUpgrade(req, socket, head);
      });
    },
  };
}
