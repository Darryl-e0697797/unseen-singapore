'use client';
import { useState, useEffect } from 'react';
import {
  reclamationExhibit,
  reclamationLabels,
  reclamationOperation,
  type ReclamationControls,
} from './reclamation-controls';
import claims from '../../../../content/workflow/reclamation-claims.json';
import sources from '../../../../content/workflow/reclamation-sources.json';
export default function ReclamationJourney({
  value,
  onChange,
  onMap,
  year,
  mode,
  stage,
  reduceMotion,
}: {
  value: ReclamationControls;
  onChange: (v: ReclamationControls) => void;
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
      () => onChange({ ...value, progress: Math.min(100, value.progress + 0.7) }),
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
  const stop = reclamationExhibit.stops[value.focus],
    labels = reclamationLabels(value, mode, stage, year),
    part = labels.find((p) => p.id === value.component),
    op = reclamationOperation(value, year);
  const evidence = [...new Set([...stop.claim_ids, ...(part?.claim_ids ?? [])])];
  return (
    <section
      className="dtss-journey barrage-journey reclamation-journey"
      aria-label="Pulau Tekong guided engineering tour"
    >
      <div className="dtss-tour-heading">
        <span>LAND BELOW THE SEA</span>
        <b>{String(value.focus + 1).padStart(2, '0')} / 09</b>
      </div>
      <p className="tuas-accuracy">
        {year < 2026
          ? 'Pre-polder context · later engineering geometry hidden. Select 2026 to explore it.'
          : 'Original schematic section · compressed distances, exaggerated heights; stations displaced for teaching.'}
      </p>
      <div className="dtss-stop-list barrage-stops">
        {reclamationExhibit.stops.map((s, i) => (
          <button
            key={s.id}
            aria-pressed={value.focus === i}
            onClick={() => {
              setRunning(false);
              onChange({
                ...value,
                focus: i,
                component: 0,
                progress: 0,
                future: false,
                comparison: false,
              });
            }}
          >
            {String(i + 1).padStart(2, '0')} {s.title}
          </button>
        ))}
      </div>
      <h3>{stop.title}</h3>
      <p>{stop.body}</p>
      <button className="mrt-map-return" onClick={onMap}>
        Back to Tekong map ↗
      </button>
      {year >= 2026 && (
        <>
          {value.focus === 1 && (
            <label>
              <input
                type="checkbox"
                checked={value.comparison}
                onChange={(e) => onChange({ ...value, comparison: e.target.checked, component: 0 })}
              />{' '}
              Compare higher infill alternative
            </label>
          )}
          {[5, 6].includes(value.focus) && (
            <div className="barrage-operation">
              <h4>Follow the water</h4>
              <div className="dtss-stop-list">
                {(['dry', 'wet'] as const).map((w) => (
                  <button
                    key={w}
                    aria-pressed={value.weather === w}
                    onClick={() => {
                      setRunning(false);
                      onChange({ ...value, weather: w, progress: 0 });
                    }}
                  >
                    {w === 'dry' ? 'Dry-weather circulation' : 'Pond at operating level'}
                  </button>
                ))}
              </div>
              <p role="status">
                {op.discharge
                  ? 'Drainage station → sea · excess water discharge'
                  : 'Central station → drains → pond · recirculation'}
              </p>
              <small>Direction only. No real flow rates or control thresholds.</small>
            </div>
          )}
          {value.focus === 7 && (
            <ol className="barrage-milestones">
              <li>
                <b>DEC 2024</b> Main works completed
              </li>
              <li>
                <b>2025</b> Further testing and commissioning
              </li>
              <li>
                <b>ONGOING CARE</b> PUB monitoring and maintenance
              </li>
            </ol>
          )}
          {value.focus === 8 && (
            <label>
              <input
                type="checkbox"
                checked={value.future}
                onChange={(e) => onChange({ ...value, future: e.target.checked })}
              />{' '}
              Show envisioned higher crest — no scheduled 2050 project
            </label>
          )}
          {[2, 3, 4, 5, 6].includes(value.focus) && (
            <div className="mrt-mechanism">
              <label>
                {value.focus === 2
                  ? 'Ground preparation'
                  : value.focus === 3
                    ? 'Local construction sequence'
                    : value.focus === 4
                      ? 'Peel open the dike'
                      : 'Trace the water'}
                <input
                  aria-label="Tekong mechanism progress"
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
                Illustrative movement and time, not a contractor programme or simulation.
              </small>
            </div>
          )}
          <details className="tuas-drawing-key" open>
            <summary>What am I looking at?</summary>
            <p>Match a drawing number to its structure.</p>
            <div className="tuas-drawing-buttons">
              {labels.map((p) => (
                <button
                  key={p.id}
                  aria-pressed={p.id === value.component}
                  onFocus={() => onChange({ ...value, component: p.id })}
                  onClick={() => onChange({ ...value, component: p.id })}
                >
                  <b>{String(p.id).padStart(2, '0')}</b> {p.title}
                </button>
              ))}
            </div>
            <article aria-live="polite">
              {part ? (
                <>
                  <h4>{part.title}</h4>
                  <p>{part.description}</p>
                </>
              ) : (
                <p>Select a number on the drawing or in this key.</p>
              )}
            </article>
          </details>
          <label>
            <input
              type="checkbox"
              checked={value.low}
              onChange={(e) => onChange({ ...value, low: e.target.checked })}
            />{' '}
            Lower graphics load
          </label>
        </>
      )}
      <details className="tuas-evidence">
        <summary>Evidence for this view</summary>
        {evidence.map((id) => {
          const c = claims.claims.find((c) => c.claim_id === id);
          return (
            c && (
              <article key={id}>
                <p>{c.statement}</p>
                <small>
                  {c.accuracy_class} · {c.verification}
                </small>
                {c.evidence.map((e) => {
                  const s = sources.find((s) => s.source_id === e.source_id);
                  return (
                    s && (
                      <p key={e.source_id}>
                        <a href={s.url} target="_blank" rel="noreferrer">
                          {s.organisation} ↗
                        </a>{' '}
                        · {e.locator}
                      </p>
                    )
                  );
                })}
              </article>
            )
          );
        })}
      </details>
    </section>
  );
}
