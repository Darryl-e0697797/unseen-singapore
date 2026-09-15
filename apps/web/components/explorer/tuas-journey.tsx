'use client';
import { useEffect, useState } from 'react';
import { visibleTuasLabels } from './tuas-labels';
import { projects } from '@unseen/world';
import claims from '../../../../content/workflow/tuas-claims.json';
import sources from '../../../../content/workflow/tuas-sources.json';
export const tuasExhibit = projects.find((p) => p.project_id === 'tuas')!.detailed_exhibit!;
export type TuasControls = {
  component?: number;
  focus: number;
  progress: number;
  section: boolean;
  treatment: boolean;
  low: boolean;
  phase: 'one' | 'two' | 'future';
};
export const initialTuas: TuasControls = {
  focus: 0,
  progress: 0,
  section: false,
  treatment: true,
  low: false,
  phase: 'one',
};
export default function TuasJourney({
  value,
  onChange,
  onMap,
  year,
  mode,
  stage,
  onInspect,
}: {
  mode: string;
  stage: number;
  onInspect: (id: number) => void;
  year: number;
  value: TuasControls;
  onChange: (v: TuasControls) => void;
  onMap: () => void;
}) {
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    if (value.progress >= 100) return;
    const started = performance.now();
    const timer = setTimeout(
      () => onChange({ ...value, progress: Math.min(100, value.progress + (performance.now() - started) * (0.25 / 16)) }),
      16,
    );
    return () => clearTimeout(timer);
  }, [running, value, onChange]);

  useEffect(() => {
    const stop = () => {
      if (document.hidden) setRunning(false);
    };
    document.addEventListener('visibilitychange', stop);
    return () => document.removeEventListener('visibilitychange', stop);
  }, []);
  const selected = visibleTuasLabels(value, year, stage, mode).find(
    (l) => l.id === value.component,
  );
  const stop = tuasExhibit.stops[value.focus];
  const eraClaims =
    year === 1958
      ? ['tuas-history-1950']
      : year === 1965
        ? ['tuas-history-1966']
        : year === 2000
          ? ['tuas-history-2000']
          : year === 2050
            ? ['tuas-capacity', 'tuas-energy-target']
            : [];
  const evidence = [
    ...new Set([...stop.claim_ids, ...eraClaims, ...(selected ? [selected.claim] : [])]),
  ].map((id) => claims.claims.find((c) => c.claim_id === id)!);
  return (
    <section className="dtss-journey tuas-journey" aria-label="Tuas guided engineering tour">
      <div className="dtss-tour-heading">
        <span>BEFORE A SHIP CAN BERTH</span>
        <b>{String(value.focus + 1).padStart(2, '0')} / 08</b>
      </div>
      {year !== 2026 && (
        <p className="tuas-accuracy">
          {year === 1958
            ? '1950s · Pre-project maritime and fishing-settlement context. No dated shoreline reconstruction.'
            : year === 1965
              ? '1965 · Before the 1966 container-port decision and 1972 opening at Tanjong Pagar. Tuas megaport does not exist.'
              : year === 2000
                ? '2000 · Pasir Panjang opened on 30 March. Tuas megaport is still pre-project.'
                : '2050 · The 2040s port-capacity programme and 2050 net-zero ambition remain targets. Outline geometry is envisioned, not an official layout.'}{' '}
          {year < 2026
            ? 'The scene shows only reference seabed; return to 2026 to inspect the engineering.'
            : 'The working port remains a schematic reference.'}
        </p>
      )}
      <p className="tuas-accuracy">
        Phase 1 teaching district · compressed distances and illustrative dimensions. Construction
        equipment appears only in its relevant story. No surveyed layout.
      </p>
      {year >= 2026 && (
        <section className="tuas-drawing-key" aria-label="Tuas drawing key">
          <h4>What am I looking at?</h4>
          <p>
            Click a number on the model or in this key. Structure numbers stay the same as you
            explore.
          </p>
          <div>
            {visibleTuasLabels(value, year, stage, mode).map((label) => (
              <button
                key={label.id}
                aria-pressed={label.id === value.component}
                onClick={() => {
                  setRunning(false);
                  onInspect(label.id);
                }}
              >
                <b>{String(label.id).padStart(2, '0')}</b>
                {label.name}
              </button>
            ))}
          </div>
          {selected && (
            <article aria-live="polite">
              <h4>
                {String(selected.id).padStart(2, '0')} · {selected.name}
              </h4>
              <p>{selected.purpose}</p>
              <small>Schematic structure · evidence below</small>
            </article>
          )}
        </section>
      )}
      <div className="dtss-stop-list">
        {tuasExhibit.stops.map((s, i) => (
          <button
            key={s.id}
            aria-pressed={value.focus === i}
            onClick={() => {
              setRunning(false);
              onChange({
                ...value,
                focus: i,
                component: undefined,
                progress: 0,
                section: [2, 3, 4, 5].includes(i),
              });
            }}
          >
            {String(i + 1).padStart(2, '0')} <span>{s.title}</span>
          </button>
        ))}
      </div>
      <h3>{stop.title}</h3>
      <p>{stop.body}</p>
      {value.focus === 1 && (
        <button className="tuas-primary" onClick={onMap}>
          Locate the port on Singapore →
        </button>
      )}
      <div className="tuas-controls">
        {[0, 3, 4, 5, 6].includes(value.focus) && (
          <button
            aria-pressed={running}
            onClick={() => {
              if (value.progress >= 100) onChange({ ...value, progress: 0 });
              setRunning(!running);
            }}
          >
            {running ? 'Pause mechanism' : 'Play mechanism'}
          </button>
        )}
        <button
          aria-pressed={value.section}
          onClick={() => onChange({ ...value, section: !value.section })}
        >
          {value.section ? 'Restore surface' : 'Open cutaway'}
        </button>
        <button aria-pressed={value.low} onClick={() => onChange({ ...value, low: !value.low })}>
          Low detail {value.low ? 'on' : 'off'}
        </button>
        {[0, 3, 4, 6].includes(value.focus) && (
          <label>
            {value.focus === 3
              ? 'Slipform rise'
              : value.focus === 4
                ? 'Tow → lower → seat'
                : 'Container hand-off'}
            <input
              aria-label={
                value.focus === 3
                  ? 'Slipform rise'
                  : value.focus === 4
                    ? 'Caisson placement'
                    : 'Container hand-off'
              }
              type="range"
              min="0"
              max="100"
              value={value.progress}
              onChange={(e) => onChange({ ...value, progress: Number(e.target.value) })}
            />
            <span>{value.progress}% · illustrative movement, no time scale</span>
          </label>
        )}
        {value.focus === 5 && (
          <>
            <button
              aria-pressed={value.treatment}
              onClick={() => onChange({ ...value, treatment: !value.treatment })}
            >
              {value.treatment ? 'Remove surcharge' : 'Apply surcharge'}
            </button>
            <p>
              Amber: temporary load · teal: drainage paths. Settlement is exaggerated; no design
              prediction.
            </p>
            <label>
              Consolidation explanation
              <input
                aria-label="Consolidation explanation"
                type="range"
                min="0"
                max="100"
                value={value.progress}
                onChange={(e) => onChange({ ...value, progress: Number(e.target.value) })}
              />
            </label>
          </>
        )}
        {value.focus === 7 && (
          <>
            <div className="tuas-phase-tabs">
              {(['one', 'two', 'future'] as const).map((p, i) => (
                <button
                  key={p}
                  aria-pressed={value.phase === p}
                  onClick={() => onChange({ ...value, phase: p })}
                >
                  {['Phase 1', 'Phase 2', 'Future'][i]}
                </button>
              ))}
            </div>
            <p>
              {value.phase === 'one'
                ? 'Phase 1: 221 caissons; 414 ha improved, including 294 ha newly reclaimed. Five metres above mean sea level is a datum, not a tide clearance.'
                : value.phase === 'two'
                  ? 'Phase 2, separate evidence: 227 caissons and 387 ha in the 2019 plan. Announced innovations include slipform jack monitoring, modular reinforcement and automated curing. Geometry remains the Phase 1 teaching district.'
                  : '2040s capacity target: 65 million TEU/year. Net-zero by 2050 is an aim. The outlined extension is an envisioned expansion cue, not an official phase boundary.'}
            </p>
            <p className="tuas-accuracy">
              Programme conflict: PSA’s August 2026 update targets 18 operating berths by 2027;
              MPA’s overview lists 21 by 2027. Measures/status are not assumed equivalent.
            </p>
          </>
        )}
      </div>
      <details className="tuas-evidence">
        <summary>Evidence & accuracy for this stop</summary>
        {evidence.map((c) => (
          <article key={c.claim_id}>
            <b>
              {c.phase} · {c.accuracy_class} · {c.verification}
            </b>
            <p>{c.statement}</p>
            <small>{c.limitations}</small>
            {c.evidence.map((e) => {
              const s = sources.find((s) => s.source_id === e.source_id)!;
              return (
                <a key={e.source_id} href={s.url} target="_blank" rel="noreferrer">
                  {s.organisation} · {e.locator} ↗
                </a>
              );
            })}
          </article>
        ))}
      </details>
      <div className="dtss-tour-footer">
        <button onClick={() => onChange({ ...value, progress: 0 })}>Reset mechanism</button>
        <button
          onClick={() =>
            onChange({
              ...initialTuas,
              low: value.low,
              focus: (value.focus + 1) % 8,
              section: [1, 2, 3, 4].includes(value.focus),
            })
          }
        >
          Next stop →
        </button>
      </div>
    </section>
  );
}
