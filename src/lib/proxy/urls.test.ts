import { describe, expect, it } from 'vitest';
import { normalizeInput } from './urls';

const SEARCH = 'https://duckduckgo.com/?q=%s';

describe('normalizeInput', () => {
  it.each([
    ['example.com', 'https://example.com/'],
    ['example.com/path?q=1', 'https://example.com/path?q=1'],
    ['http://example.com', 'http://example.com/'],
    ['https://sub.example.co.uk', 'https://sub.example.co.uk/'],
    ['localhost:3000', 'http://localhost:3000/'],
    ['192.168.1.1', 'http://192.168.1.1/'],
    ['  example.com  ', 'https://example.com/'],
  ])('treats %s as a URL', (input, expected) => {
    expect(normalizeInput(input, SEARCH)).toBe(expected);
  });

  it.each([
    [
      'testing sentance here',
      'https://duckduckgo.com/?q=testing%20sentance%20here',
    ],
    ['sailfish', 'https://duckduckgo.com/?q=sailfish'],
    ['what is 1+1?', 'https://duckduckgo.com/?q=what%20is%201%2B1%3F'],
    ['999.1.1.1', 'https://duckduckgo.com/?q=999.1.1.1'],
    ['1.2.3.4:99999', 'https://duckduckgo.com/?q=1.2.3.4%3A99999'],
    ['localhost:99999', 'https://duckduckgo.com/?q=localhost%3A99999'],
    ['example.com:70000', 'https://duckduckgo.com/?q=example.com%3A70000'],
    [
      'javascript://%0aalert(1)',
      'https://duckduckgo.com/?q=javascript%3A%2F%2F%250aalert(1)',
    ],
    [
      'file:///etc/passwd',
      'https://duckduckgo.com/?q=file%3A%2F%2F%2Fetc%2Fpasswd',
    ],
    ['ftp://example.com', 'https://duckduckgo.com/?q=ftp%3A%2F%2Fexample.com'],
  ])('treats %s as a search', (input, expected) => {
    expect(normalizeInput(input, SEARCH)).toBe(expected);
  });

  it('keeps sail:// URLs as they are', () => {
    expect(normalizeInput('sail://settings', SEARCH)).toBe('sail://settings');
  });

  it('returns an empty string for blank input', () => {
    expect(normalizeInput('      ', SEARCH)).toBe('');
  });
});
