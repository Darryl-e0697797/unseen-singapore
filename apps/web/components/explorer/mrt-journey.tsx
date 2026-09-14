'use client';
import { useEffect, useState } from 'react';
import { mrtExhibit, mrtLabels, type MrtControls } from './mrt-controls';
import claims from '../../../../content/workflow/mrt-claims.json';
import sources from '../../../../content/workflow/mrt-sources.json';
export default function MrtJourney({
  value,
  onChange,
  onMap,
  year,
  mode,
  stage,
  reduceMotion,
}: {
  value: MrtControls;
  onChange: (v: MrtControls) => void;
  onMap: () => void;
  year: number;
  mode: string;
  stage: number;
  reduceMotion: boolean;
}) {
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running || reduceMotion || value.progress >= 100) return;
    const t = setTimeout(
      () => onChange({ ...value, progress: Math.min(100, value.progress + 0.5) }),
      40,
    );
    return () => clearTimeout(t);
  }, [running, reduceMotion, value, onChange]);
  useEffect(() => {
    const stop = () => {
      if (document.hidden) setRunning(false);
    };
    document.addEventListener('visibilitychange', stop);
    return () => document.removeEventListener('visibilitychange', stop);
  }, []);
  const stop = mrtExhibit.stops[value.focus],
    visible = mrtLabels(value, mode, stage, year),
    part = visible.find((x) => x.id === value.component);
  const evidence = [...new Set([...stop.claim_ids, ...(part?.claim_ids ?? [])])];
  function focus(i: number) {
    setRunning(false);
    onChange({ ...value, focus: i, component: 0, progress: 0 });
  }
  return (
    <section className="dtss-journey mrt-journey" aria-label="MRT guided engineering tour">
      <div className="dtss-tour-heading">
        <span>A CITY BENEATH A CITY</span>
        <b>{String(value.focus + 1).padStart(2, '0')} / 09</b>
      </div>
      <p className="tuas-accuracy">
        {year < 2026
          ? 'Historical context · this modern teaching section is hidden. The surface is present-day reference.'
          : year === 2050
            ? '2050 · envisioned continuation, not an official 2050 alignment.'
            : 'Original teaching section · compressed distances, not one real station.'}
      </p>
      <div className="dtss-stop-list">
        {mrtExhibit.stops.map((s, i) => (
          <button key={s.id} aria-pressed={value.focus === i} onClick={() => focus(i)}>
            {String(i + 1).padStart(2, '0')} {s.title}
          </button>
        ))}
      </div>
      <h3>{stop.title}</h3>
      <p>{stop.body}</p>
      <button className="mrt-map-return" onClick={onMap}>
        View MRT network on map ↗
      </button>
      {year >= 2026 && (
        <>
          <section className="tuas-drawing-key" aria-label="MRT drawing key">
            <h4>What am I looking at?</h4>
            <p>Match a number on the drawing. Only parts present in this view are listed.</p>
            <div className="tuas-drawing-buttons">
              {visible.map((p) => (
                <button
                  key={p.id}
                  aria-pressed={p.id === value.component}
                  onClick={() => onChange({ ...value, component: p.id })}
                >
                  <b>{String(p.id).padStart(2, '0')}</b> {p.title}
                </button>
              ))}
            </div>
            <article aria-live="polite">
              {part ? (
                <>
                  <h4>
                    {String(part.id).padStart(2, '0')} · {part.title}
                  </h4>
                  <p>{part.description}</p>
                </>
              ) : (
                <p>Select a numbered structure to learn its purpose.</p>
              )}
            </article>
          </section>
          {[3, 4, 5, 7].includes(value.focus) && (
            <div className="mrt-mechanism">
              <h4>
                {value.focus === 3
                  ? 'Make a wall panel'
                  : value.focus === 4
                    ? 'Excavate in supported stages'
                    : value.focus === 5
                      ? 'Advance, remove spoil, install lining'
                      : 'Marina Bay · separate freezing case'}
              </h4>
              {value.focus === 4 && (
                <div className="dtss-stop-list">
                  {(['top-down', 'bottom-up'] as const).map((m) => (
                    <button
                      key={m}
                      aria-pressed={value.method === m}
                      onClick={() => {
                        setRunning(false);
                        onChange({ ...value, method: m, progress: 0 });
                      }}
                    >
                      {m === 'top-down' ? 'Top-down' : 'Bottom-up'}
                    </button>
                  ))}
                </div>
              )}
              <label>
                {value.focus === 3
                  ? 'Wall panel sequence'
                  : value.focus === 4
                    ? 'Excavation sequence'
                    : value.focus === 5
                      ? 'Tunnel assembly'
                      : 'Freezing sequence'}
                <input
                  aria-label="MRT mechanism progress"
                  type="range"
                  min="0"
                  max="100"
                  value={value.progress}
                  onChange={(e) => {
                    setRunning(false);
                    onChange({ ...value, progress: Number(e.target.value) });
                  }}
                />
              </label>
              <p>
                {value.focus === 7
                  ? value.progress < 35
                    ? 'Insert pipes and grow frozen zones.'
                    : value.progress < 80
                      ? 'Frozen zones meet; reveal the supported excavation.'
                      : 'Completed case: temporary ice is removed.'
                  : value.focus === 5
                    ? value.progress < 50
                      ? 'Illustrative EPB advance and rearward spoil movement.'
                      : 'Install lining and reveal the annular grout.'
                    : value.focus === 3
                      ? value.progress < 34
                        ? 'Slurry-supported trench.'
                        : value.progress < 67
                          ? 'Lower the reinforcement cage.'
                          : 'Complete the concrete wall panel.'
                      : 'The section changes as construction progresses.'}
              </p>
              <div className="dtss-stop-list">
                <button
                  disabled={reduceMotion}
                  onClick={() => {
                    if (value.progress >= 100) onChange({ ...value, progress: 0 });
                    setRunning((v) => value.progress >= 100 || !v);
                  }}
                >
                  {running && value.progress < 100 ? 'Pause mechanism' : 'Play mechanism'}
                </button>
                <button
                  onClick={() => {
                    setRunning(false);
                    onChange({ ...value, progress: 0 });
                  }}
                >
                  Reset mechanism
                </button>
              </div>
              <small>
                Qualitative teaching animation · no pressure, settlement or thermal simulation.
              </small>
            </div>
          )}
        </>
      )}
      <label className="mrt-quality">
        <input
          type="checkbox"
          checked={value.low}
          onChange={(e) => onChange({ ...value, low: e.target.checked })}
        />{' '}
        Low graphics
      </label>
      <details>
        <summary>Engineering evidence & limits</summary>
        {evidence.map((id) => {
          const c = claims.claims.find((x) => x.claim_id === id)!;
          return (
            <article key={id}>
              <p>{c.statement}</p>
              <small>
                {c.verification} · {c.limitations}
              </small>
              <div className="chapter-sources">
                {c.evidence.map((e) => {
                  const s = sources.find((x) => x.source_id === e.source_id)!;
                  return (
                    <a
                      key={e.source_id}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      title={e.locator}
                    >
                      {s.organisation} ↗
                    </a>
                  );
                })}
              </div>
            </article>
          );
        })}
      </details>
    </section>
  );
}
