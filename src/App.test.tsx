import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/proxy/proxy', () => ({
  proxy: { createFrame: vi.fn(() => new Promise(() => {})) },
}));

import App from './App';

describe('App', () => {
  it('renders the address input', () => {
    render(<App />);
    expect(screen.getByLabelText('Address')).toBeInTheDocument();
  });
});
