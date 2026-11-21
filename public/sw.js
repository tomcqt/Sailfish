/** Sailfish service worker
 *
 * The heavy lifting lives in controller.sw.js. It knows which URL prefixes
 * belong to which open Sailfish page (each page's Controller registers itself
 * over postMessage) and relays matching requests back to that page, where
 * Scramjet fetches and rewrites them.
 *
 * This file should be kept small and dependency-free. Make sure to bump
 * SW_VERSION when you change it so that the browsers pick up the new worker.
 * This version number is tracked independently of the Sailfish version number,
 * which is tracked in package.json.
 */

const SW_VERSION = '0.1.0';

importScripts('/controller/controller.sw.js');

self.addEventListener('fetch', (event) => {
  // $scramjetController is set by controller.sw.js above
  if ($scramjetController.shouldRoute(event)) {
    event.respondWith($scramjetController.route(event));
  }
  // Anything else (Sailfish itself) falls through to the network
});

self.addEventListener('message', (event) => {
  if (event.data === 'sailfish:version') {
    event.source?.postMessage({
      type: 'sailfish:version',
      version: SW_VERSION,
    });
  }
});
