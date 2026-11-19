import { fileURLToPath } from 'node:url';
import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import { configureWisp, handleWispUpgrade, WISP_PATH } from './wisp.ts';

const PORT = Number(process.env.PORT ?? 8080);
// Default to localhost. Set HOST=0.0.0.0 in Docker or on a PaaS.
const HOST = process.env.HOST ?? '127.0.0.1';
const DIST = fileURLToPath(new URL('../dist', import.meta.url));

const app = Fastify({ logger: { level: process.env.LOG_LEVEL ?? 'info' } });

await app.register(fastifyStatic, {
  root: DIST,
  // index.html must never be cached long, or users keep an old shell that
  // points at deleted hashed assets after a deploy.
  setHeaders(reply, filePath) {
    if (filePath.endsWith('index.html') || filePath.endsWith('sw.js')) {
      reply.header('Cache-Control', 'no-cache');
    } else if (filePath.includes('/assets/')) {
      reply.header('Cache-Control', 'public, max-age=31536000, immutable');
    }
  },
});

// This is a single-page app. Unknown paths get the shell, so deep links work.
app.setNotFoundHandler((_req, reply) => reply.sendFile('index.html'));

configureWisp();
app.server.on('upgrade', (req, socket, head) => {
  if (!handleWispUpgrade(req, socket, head)) socket.destroy();
});

await app.listen({ port: PORT, host: HOST });
app.log.info(
  `Sailfish is running on http://${HOST}:${PORT} (Wisp at ${WISP_PATH})`,
);
