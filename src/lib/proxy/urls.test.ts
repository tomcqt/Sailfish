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
