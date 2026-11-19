// Adds matchers like toBeInTheDocument() to Vitest's expect().
import '@testing-library/jest-dom/vitest';

// Vitest skips Vite's `define`, so provite the constant for tests.
(globalThis as Record<string, unknown>).__APP_VERSION__ = '0.0.0-test';
