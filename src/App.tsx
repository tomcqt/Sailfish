import { useRef, useState, useEffect, type FormEvent } from 'react';
import { proxy } from '@/lib/proxy/proxy';
import { normalizeInput } from '@/lib/proxy/urls';
import type { Frame } from '@/lib/proxy/scramjet';

const SEARCH = 'https://duckduckgo.com/?q=%s';

export default function App() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const frameRef = useRef<Frame | null>(null);
  const [input, setInput] = useState('example.com');
  const [status, setStatus] = useState('starting...');

  useEffect(() => {
    let cancelled = false;
    proxy
      .createFrame(iframeRef.current!)
      .then((frame) => {
        if (cancelled) return;
        frameRef.current = frame;
        setStatus('ready');
      })
      .catch((err: unknown) => setStatus(`proxy failed: ${String(err)}`));
    return () => {
      cancelled = true;
    };
  }, []);

  function go(event: FormEvent) {
    event.preventDefault();
    const url = normalizeInput(input, SEARCH);
    if (url && frameRef.current) frameRef.current.go(url);
  }

  return (
    <div
      style={{ display: 'grid', gridTemplateRows: 'auto 1fr', height: '100vh' }}
    >
      <form onSubmit={go} style={{ display: 'flex', gap: 8, padding: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flex: 1 }}
          aria-label="Address"
        />
        <button type="submit" disabled={status !== 'ready'}>
          Go
        </button>
        <span>{status}</span>
      </form>
      <iframe
        ref={iframeRef}
        title="page"
        style={{ border: 0, width: '100%', height: '100%' }}
      />
    </div>
  );
}
