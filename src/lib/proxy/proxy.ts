import LibcurlClient from '@mercuryworkshop/libcurl-transport';
import { type Controller, type Frame, getScramjetController } from './scramjet';

export interface ProxyOptions {
  /** The full Wisp URL, e.g. wss://example.com/wisp/ */
  wispUrl: string;
}

/**
 * The default Wisp URL, which is on the same host as the main Sailfish page.
 * @param loc The URL location.
 * @returns The calculated default URL.
 */
export function defaultWispUrl(loc: Location = location): string {
  const scheme = loc.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${scheme}//${loc.host}/wisp/`;
}

/**
 * Owns the Scramjet controller for this page.
 *
 * Must call `init()` once at startup and then use `createFrame()` for each tab
 * iframe. Methods are safe to call while `init()` runs, as they await it.
 */
export class ProxyService {
  private controller: Controller | null = null;
  private booting: Promise<void> | null = null;
  private wispUrl: string;
  private transport: LibcurlClient | null = null;

  constructor(options: ProxyOptions) {
    this.wispUrl = options.wispUrl;
  }

  /**
   * Registers the service worker and starts the controller. This is safe to
   * call many times.
   */
  public init(): Promise<void> {
    this.booting ??= this.boot().catch((err) => {
      // Let a later call retry instead of catching the failure forever
      this.booting = null;
      throw err;
    });
    return this.booting;
  }

  private async boot(): Promise<void> {
    if (!('serviceWorker' in navigator)) {
      throw new Error(
        'This browser does not support service workers (or the page is not ' +
          'HTTPS).',
      );
    }
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });
    await navigator.serviceWorker.ready;

    const worker = navigator.serviceWorker.controller ?? registration.active;
    if (!worker) throw new Error('Service worker did not activate.');

    const transport = await this.createTransport(this.wispUrl);
    const { Controller } = getScramjetController();
    const controller = new Controller({ serviceworker: worker, transport });

    await controller.wait();
    this.controller = controller;
    this.transport = transport;
  }

  /**
   * Releases a transport that is no longer in use. LibcurlClient has no
   * close method of its own, so this closes its libcurl HTTP session, which
   * aborts its pending requests and closes its pooled Wisp streams.
   * @param transport The transport to release.
   */
  private disposeTransport(transport: LibcurlClient): void {
    try {
      transport.session?.close();
    } catch (err) {
      console.warn('Failed to close the previous proxy transport:', err);
    }
  }

  private async createTransport(wisp: string): Promise<LibcurlClient> {
    const transport = new LibcurlClient({ wisp });
    await transport.init();
    return transport;
  }

  /**
   * Wraps an iframe so navigations inside it go through the proxy.
   * @param iframe The iframe to wrap.
   * @returns The wrapped frame.
   */
  public async createFrame(iframe: HTMLIFrameElement): Promise<Frame> {
    await this.init();
    return this.controller!.createFrame(iframe);
  }

  /**
   * Points every open and future frame at a different Wisp server
   * @param url The server URL to point to
   */
  public async setWispUrl(url: string): Promise<void> {
    await this.init();
    const transport = await this.createTransport(url);
    const previous = this.transport;
    this.controller!.setTransport(transport);
    this.transport = transport;
    this.wispUrl = url;
    // Only release the old transport once the swap has succeeded.
    if (previous && previous !== transport) this.disposeTransport(previous);
  }

  /**
   * Turns a proxied iframe URL back into the real site URL.
   * @param frame The iframe to decode from.
   * @param href The proxied href of the iframe.
   * @returns The decoded URL, or null when `href` is not one of this frame's
   *  proxied URLs.
   */
  public decodeFrameUrl(frame: Frame, href: string): string | null {
    let prefix = new URL(frame.prefix, location.href).href;
    // Verify that this.controller exists.
    if (!this.controller) throw Error('Controller is not properly initialised');
    // Normalise having an ending slash on prefixes.
    if (!prefix.endsWith('/')) prefix += '/';
    if (!href.startsWith(prefix)) return null;
    const encoded = href.slice(prefix.length);
    try {
      return this.controller!.config.codec.decode(encoded);
    } catch {
      return null;
    }
  }
}

/** Proxy instance for the browser */
export const proxy = new ProxyService({ wispUrl: defaultWispUrl() });
