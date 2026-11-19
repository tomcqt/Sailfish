// Minimal typings for the parts of @mercuryworkshop/wisp-js/server we use.
// Must be extended if we want to use more of the API.

declare module '@mercuryworkshop/wisp-js/server' {
  import type { IncomingMessage } from 'node:http';
  import type { Duplex } from 'node:stream';

  export const server: {
    options: {
      hostname_blacklist: RegExp[] | null;
      hostname_whitelist: RegExp[] | null;
      port_blacklist: (number | [number, number])[] | null;
      port_whitelist: (number | [number, number])[] | null;
      allow_direct_ip: boolean;
      allow_private_ips: boolean;
      allow_loopback_ips: boolean;
      allow_udp_streams: boolean;
      dns_method: 'lookup' | 'resolve';
      dns_servers: string[] | null;
      dns_result_order: 'verbatim' | 'ipv4first' | 'ipv6first';
      wisp_version: 1 | 2;
      wisp_motd: string | null;
    };
    routeRequest(req: IncomingMessage, socket: Duplex, head: Buffer): void;
  };

  export const logging: {
    DEBUG: number;
    INFO: number;
    WARN: number;
    ERROR: number;
    NONE: number;
    set_level(level: number): void;
  };
}
