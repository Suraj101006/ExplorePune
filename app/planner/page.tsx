'use client';

import { useState } from 'react';
import Link from 'next/link';

const STARTS: Record<string, [number, number]> = {
  'Shaniwar Wada': [18.5195, 73.8553], 'Pune Railway Station': [18.5289, 73.8744], 'Swargate': [18.5018, 73.8636],
  'Deccan Gymkhana': [18.5167, 73.8409], 'Shivajinagar': [18.5308, 73.8475], 'Hinjewadi': [18.5912, 73.7389],
};
const INTERESTS: [string, string][] = [['heritage', 'Heritage'], ['forts', 'Forts'], ['temples', 'Temples'], ['museums', 'Museums'], ['parks', 'Parks and gardens'], ['nature', 'Lakes and viewpoints']];

export default function PlannerPage() {
  const [duration, setDuration] = useState(120);
  const [mode, setMode] = useState('walking');
  const [budget, setBudget] = useState('500');
  const [start, setStart] = useState('Shaniwar Wada');
  const [time, setTime] = useState('09:30');
  const [interests, setInterests] = useState<string[]>([]);
  const [includeUnverified, setIncludeUnverified] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(''); setResult(null);
    const [h, m] = time.split(':').map(Number);
    const [lat, lng] = STARTS[start];
    try {
      const res = await fetch('/api/v1/itineraries/generate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ availableMinutes: duration, mode, budgetPerPerson: budget ? Number(budget) : undefined, includeUnverified, interests, startMinuteOfDay: h * 60 + m, start: { lat, lng } }),
      });
      const json = await res.json();
      if (json.data) setResult(json.data); else setError(json.error?.message ?? 'Could not build a plan. Please try again.');
    } catch {
      setError('No connection. Check your internet and try again.');
    } finally { setLoading(false); }
  }

  const toggle = (k: string) => setInterests((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));

  return (
    <main className="wrap" style={{ paddingTop: 36 }}>
      <h1 style={{ margin: '0 0 6px' }}>Trip planner</h1>
      <p style={{ color: 'var(--muted)', margin: '0 0 24px', maxWidth: '60ch' }}>Tell us how much time you have. We’ll pick places that fit, and say plainly where we’re unsure of hours or fees.</p>
      <div className="two">
        <form onSubmit={generate} className="panel" style={{ height: 'fit-content' }}>
          <div className="field"><label htmlFor="start">Start from</label>
            <select id="start" value={start} onChange={(e) => setStart(e.target.value)}>{Object.keys(STARTS).map((s) => <option key={s}>{s}</option>)}</select></div>
          <div className="field"><label htmlFor="time">Start time</label><input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required /></div>
          <div className="field"><label htmlFor="dur">Time available (minutes)</label>
            <input id="dur" type="number" min={30} max={720} step={15} value={duration} onChange={(e) => setDuration(Number(e.target.value))} required /></div>
          <div className="field"><label htmlFor="mode">Getting around</label>
            <select id="mode" value={mode} onChange={(e) => setMode(e.target.value)}><option value="walking">Walking</option><option value="cycling">Cycling</option><option value="driving">Driving</option></select></div>
          <div className="field"><label htmlFor="bud">Budget per person (₹)</label><input id="bud" type="number" min={0} value={budget} onChange={(e) => setBudget(e.target.value)} /></div>
          <fieldset className="field" style={{ border: 0, padding: 0 }}><legend>Interests (leave empty for everything)</legend>
            {INTERESTS.map(([k, label]) => (
              <label key={k} style={{ display: 'flex', gap: 8, fontWeight: 400, marginBottom: 4 }}><input type="checkbox" checked={interests.includes(k)} onChange={() => toggle(k)} style={{ width: 'auto' }} />{label}</label>))}
          </fieldset>
          <label style={{ display: 'flex', gap: 8, marginBottom: 18, fontSize: 14 }}><input type="checkbox" checked={includeUnverified} onChange={(e) => setIncludeUnverified(e.target.checked)} />Include places whose hours aren’t verified</label>
          <button className="btn" disabled={loading} style={{ width: '100%' }}>{loading ? 'Building your plan…' : 'Build my plan'}</button>
        </form>

        <div aria-live="polite" style={{ display: 'grid', gap: 12, alignContent: 'start' }}>
          {error && <p className="note err">{error}</p>}
          {!result && !error && !loading && <p className="panel" style={{ color: 'var(--muted)', margin: 0 }}>Your plan will appear here.</p>}
          {result && !result.feasible && <p className="note">Nothing fits in that time. Try more minutes, fewer interests, or allow unverified places.</p>}
          {result?.feasible && (<>
            <div className="panel" style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <div>Time used<br /><strong style={{ fontSize: 22 }}>{result.totalDurationMinutes} min</strong></div>
              <div>Spare time<br /><strong style={{ fontSize: 22 }}>{result.bufferMinutes} min</strong></div>
              <div>Known entry fees<br /><strong style={{ fontSize: 22, color: 'var(--clay)' }}>₹{result.knownCost}</strong></div>
            </div>
            {result.unknownCosts?.length > 0 && <p className="note">Entry fee unknown for: {result.unknownCosts.join(', ')}. This isn’t counted as free.</p>}
            {result.warnings?.length > 0 && <div className="note">{result.warnings.map((w: string, i: number) => <p key={i} style={{ margin: '2px 0' }}>{w}</p>)}</div>}
            {result.stops.map((s: any, i: number) => (
              <div key={s.placeId} className="stop">
                <span className="n">{i + 1}</span>
                <div style={{ flex: 1 }}><strong>{s.placeName}</strong><br /><span style={{ color: 'var(--muted)', fontSize: 14 }}>{s.travelMinutes} min travel, {s.visitMinutes} min visit</span></div>
                <Link href={`/places/${s.placeSlug}`}>Details</Link>
              </div>))}
          </>)}
        </div>
      </div>
    </main>
  );
}
