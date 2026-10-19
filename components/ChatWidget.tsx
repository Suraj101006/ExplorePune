'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

type Msg = { role: 'me' | 'bot'; text: string };
const HINTS = ['What is Shaniwar Wada?', 'Tell me about Sinhagad', 'Which museums are listed?'];

function withLinks(text: string) {
  return text.split(/(\/places\/[a-z0-9-]+)/gi).map((part, i) =>
    part.startsWith('/places/') ? <Link key={i} href={part}>{part}</Link> : part);
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState('');
  const [log, setLog] = useState<Msg[]>([{ role: 'bot', text: 'Ask me about places in Pune. I only answer from this site’s own records.' }]);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => end.current?.scrollIntoView({ block: 'end' }), [log, open]);

  async function send(text: string) {
    const message = text.trim();
    if (!message || busy) return;
    setInput(''); setBusy(true);
    setLog((l) => [...l, { role: 'me', text: message }]);
    try {
      const res = await fetch('/api/v1/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message }) });
      const json = await res.json();
      setLog((l) => [...l, { role: 'bot', text: json.reply ?? json.error?.message ?? 'Something went wrong. Please try again.' }]);
    } catch {
      setLog((l) => [...l, { role: 'bot', text: 'No connection. Check your internet and try again.' }]);
    } finally { setBusy(false); }
  }

  return (
    <>
      {open && (
        <section className="chat-panel" aria-label="Pune assistant">
          <div className="chat-log" aria-live="polite">
            {log.map((m, i) => <div key={i} className={`msg ${m.role}`}>{m.role === 'bot' ? withLinks(m.text) : m.text}</div>)}
            {log.length === 1 && HINTS.map((h) => <button key={h} className="chip" onClick={() => send(h)}>{h}</button>)}
            {busy && <div className="msg bot">Looking that up…</div>}
            <div ref={end} />
          </div>
          <form className="chat-form" onSubmit={(e) => { e.preventDefault(); send(input); }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} maxLength={500} placeholder="Ask about a place" aria-label="Your question" />
            <button className="btn" disabled={busy}>Send</button>
          </form>
        </section>
      )}
      <button className="btn chat-fab clay" onClick={() => setOpen((o) => !o)} aria-expanded={open}>{open ? 'Close chat' : 'Ask about Pune'}</button>
    </>
  );
}
