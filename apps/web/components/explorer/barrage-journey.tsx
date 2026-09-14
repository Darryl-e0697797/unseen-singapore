'use client';
import { useEffect, useState } from 'react';
import {
  barrageExhibit,
  barrageLabels,
  barrageOperation,
  type BarrageControls,
} from './barrage-controls';
import claims from '../../../../content/workflow/barrage-claims.json';
import sources from '../../../../content/workflow/barrage-sources.json';
export default function BarrageJourney({
  value,
  onChange,
  onMap,
  year,
  mode,
  stage,
  reduceMotion,
}: {
  value: BarrageControls;
  onChange: (v: BarrageControls) => void;
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
      () => onChange({ ...value, progress: Math.min(100, value.progress + 0.6) }),
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
  const stop = barrageExhibit.stops[value.focus],
    labels = barrageLabels(value, mode, stage, year),
    part = labels.find((x) => x.id === value.component),
    operation = barrageOperation(value, year);
  const evidence = [...new Set([...stop.claim_ids, ...(part?.claim_ids ?? [])])];
  return (
    <section
      className="dtss-journey barrage-journey"
      aria-label="Marina Barrage guided engineering tour"
    >
      <div className="dtss-tour-heading">
        <span>WHEN RAIN MEETS THE TIDE</span>
        <b>{String(value.focus + 1).padStart(2, '0')} / 09</b>
      </div>
      <p className="tuas-accuracy">
        {year < 2026
          ? 'Pre-project · modern surface reference; Barrage geometry hidden.'
          : value.focus === 8
            ? 'Future proposal · envisioned geometry, not final design.'
            : [4, 5, 7].includes(value.focus)
              ? 'Enlarged schematic cutaway · pump displaced beside gate; not a surveyed section.'
              : 'Original teaching model · compressed distances and simplified shapes.'}
      </p>
      <div className="dtss-stop-list barrage-stops">
        {barrageExhibit.stops.map((s, i) => (
          <button
            key={s.id}
            aria-pressed={i === value.focus}
            onClick={() => {
              setRunning(false);
              onChange({
                ...value,
                focus: i,
                component: 0,
                progress: 0,
                weather: i === 4 ? 'low' : i === 5 ? 'high' : 'calm',
                future: false,
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
        Back to Barrage map ↗
      </button>
      {year >= 2026 && (
        <>
          {[4, 5].includes(value.focus) && (
            <div className="barrage-operation">
              <h4>Change the conditions</h4>
              <div className="dtss-stop-list">
                {(['calm', 'low', 'high'] as const).map((w) => (
                  <button
                    key={w}
                    aria-pressed={value.weather === w}
                    onClick={() => {
                      setRunning(false);
                      onChange({
                        ...value,
                        weather: w,
                        component: 0,
                        focus: w === 'high' ? 5 : w === 'low' ? 4 : value.focus,
                      });
                    }}
                  >
                    {w === 'calm'
                      ? 'No excess rain'
                      : w === 'low'
                        ? 'Rain + low tide'
                        : 'Rain + high tide'}
                  </button>
                ))}
              </div>
              <p role="status">
                {operation.gateOpen
                  ? 'Gate lowered · gravity releases water to sea'
                  : operation.pumping
                    ? 'Gate closed · pumps discharge excess water'
                    : 'Gate closed · drainage pumps idle'}
              </p>
              <small>Relative levels only. No flow forecast or operational thresholds.</small>
            </div>
          )}
          {value.focus === 6 && (
            <ol className="barrage-milestones">
              <li>
                <b>31 OCT 2008</b> Barrage opens
              </li>
              <li>
                <b>APR 2009</b> Natural desalting begins
              </li>
              <li>
                <b>20 NOV 2010</b> Freshwater commissioning
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
              Show possible future gap treatment
            </label>
          )}
          {[2, 3, 4, 5, 6].includes(value.focus) && (
            <div className="mrt-mechanism">
              <label>
                {value.focus === 2
                  ? 'Remove construction water'
                  : value.focus === 3
                    ? 'Conceptual assembly'
                    : value.focus === 6
                      ? 'Conceptual freshwater transition'
                      : 'Trace the water'}
                <input
                  aria-label="Barrage mechanism progress"
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
                {[2, 3].includes(value.focus)
                  ? 'Illustrative sequence, not a historical method statement.'
                  : value.focus === 6
                    ? 'Colour illustrates change; it is not measured salinity.'
                    : 'Direction-only animation, not a hydraulic simulation.'}
              </small>
            </div>
          )}
          <section className="tuas-drawing-key" aria-label="Barrage drawing key">
            <h4>What am I looking at?</h4>
            <p>Match each number to its structure. Choose a part to learn why it exists.</p>
            <div className="tuas-drawing-buttons">
              {labels.map((p) => (
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
                <p>Select a number on the drawing or in this key.</p>
              )}
            </article>
          </section>
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
                {c.evidence.map((e, i) => {
                  const s = sources.find((x) => x.source_id === e.source_id)!;
                  return (
                    <a key={i} href={s.url} target="_blank" rel="noreferrer" title={e.locator}>
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
