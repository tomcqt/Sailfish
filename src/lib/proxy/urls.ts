/** Matches "scheme://" at the start, e.g. https://, sail:// */
const SCHEME = /^[a-z][a-z\d+.-]*:\/\//i;
/** host[:port][/...] where host has a dot and a 2+ letter TLD */
const DOMAIN = /^([a-z\d-]+\.)+[a-z]{2,}(:\d{1,5})?(\/\S*)?$/i;
/** IPv4 address with optional port and path */
const IPV4 = /^(\d{1,3}\.){3}\d{1,3}(:\d{1,5})?(\/\S*)?$/i;
/** localhost address with optional port and path */
const LOCALHOST = /^localhost(:\d{1,5})?(\/\S*)?$/i;

/**
 * Converts what the user typed into a URL to load.
 *
 * - Anything that has a scheme is kept, and is parsed and reserialised when it
 *   is http or https so that "http://a.com" becomes "http://a.com/".
 * - Bare domains automatically have https added to them and localhost and IPs
 *   have http.
 * - Everything else becomes a search query using `searchTemplate`, where %s is
 *   replaced by the encoded query.
 *
 * @returns '' for blank input.
 */
export function normalizeInput(raw: string, searchTemplate: string): string {
  const input = raw.trim();
  if (!input) return '';

  if (SCHEME.test(input)) {
    if (/^https?:/i.test(input)) {
      try {
        return new URL(input).href;
      } catch {
        // Fall through to search.
      }
    } else {
      return input;
    }
  }

  if (!/\s/.test(input)) {
    if (LOCALHOST.test(input) || IPV4.test(input))
      return new URL(`http://${input}`).href;
    if (DOMAIN.test(input)) return new URL(`https://${input}`).href;
  }

  return searchTemplate.replace('%s', encodeURIComponent(input));
}
