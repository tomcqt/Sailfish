import type { IncomingMessage } from 'node:http';
import type { Duplex } from 'node:stream';
import { logging, server as wisp } from '@mercuryworkshop/wisp-js/server';

/** Path the browser connects to, e.g. wss://host/wisp/ */
export const WISP_PATH = '/wisp/';

let configured = false;

/**
 * Applies Sailfish's Wisp policy once per process.
 *
 * Security: allow_private_ips and allow_loopback_ips stay false, so a visitor
 * cannot use your server to reach 127.0.0.1, 10.x, 192.168.x, or cloud
 * metadata endpoints (169.254.169.254). Never turn these on for a public
 * deployment.
 */
export function configureWisp(): void {
  if (configured) return;
  configured = true;

  logging.set_level(logging.WARN);
  wisp.options.allow_private_ips = false;
  wisp.options.allow_loopback_ips = false;
  // UDP is only needed for things like QUIC/WebRTC experiments, keep the
  // attack surface small until a feature needs it.
  wisp.options.allow_udp_streams = false;
  // Resolve DNS through public resolvers rather than the host's, so results
  // match what users expect and avoid split-horizon internal names.
  wisp.options.dns_method = 'resolve';
  wisp.options.dns_servers = ['1.1.1.1', '1.0.0.1'];
  wisp.options.dns_result_order = 'ipv4first';
  wisp.options.wisp_version = 2;
}

/**
 * Handles an HTTP upgrade if it targets the Wisp path.
 *
 * @returns true when the request was taken by Wisp, false lets another
 *   listener (ex. Vite's HMR socket) handle it.
 */
export function handleWispUpgrade(
  req: IncomingMessage,
  socket: Duplex,
  head: Buffer,
): boolean {
  const path = new URL(req.url ?? '/', 'http://localhost').pathname;
  if (path !== WISP_PATH) return false;
  wisp.routeRequest(req, socket, head);
  return true;
}
