'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useCallback, useRef, useState, useSyncExternalStore, type FormEvent } from 'react';
import { applyCommands, initialScene } from '@unseen/scene-engine';
import { askSingapore, type Answer } from '@unseen/ai-controller';
import { assets, sources, registry } from '@unseen/data';
import type { Level, SceneCommand } from '@unseen/shared/schema';
import { SceneBoundary } from './scene-boundary';
const World = dynamic(() => import('./world'), {
  ssr: false,
  loading: () => <p className="loading-label">Preparing the architectural model…</p>,
});
const welcome: Answer = {
  intent: 'welcome',
  title: 'Follow one drop through Singapore.',
  narrative:
    'Beneath the familiar skyline is a different kind of city. Explore the engineering that carries used water towards treatment — and makes reuse possible.',
  source_ids: ['pub-dtss'],
  commands: [],
};
const annotations: Record<string, [string, string]> = {
  purpose: [
    'A connected system',
    'Local collection → deep tunnel → reclamation. Select the tunnel to look closer.',
  ],
  flow: [
    'Conveyance, then treatment',
    'Moving marker shows direction only. Treatment and reuse take place downstream, outside this section.',
  ],
  depth: [
    'An explanatory section',
    'Depths and distances are illustrative. This is not an alignment or a hydraulic simulation.',
  ],
  rail: [
    'A separate transport system',
    'Relative positions are illustrative. The ochre corridor is not a particular MRT line.',
  ],
};
function useMedia(query: string) {
  const subscribe = useCallback(
    (listener: () => void) => {
      const m = matchMedia(query);
      m.addEventListener('change', listener);
      return () => m.removeEventListener('change', listener);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => matchMedia(query).matches,
    () => false,
  );
}
function Orientation() {
  return (
    <div className="orientation">
      <svg viewBox="0 0 150 80" aria-label="Schematic Singapore orientation silhouette" role="img">
        <path
          d="m8 48 10-17 17-8 10-12 17 2 14 7 18 3 13 11 17 4 13 13-12 8-11-2-5 9-20-1-12 7-17-9-14 1-12-10z"
          fill="#b5c2ab"
          stroke="#8b9c82"
          strokeWidth=".7"
        />
        <path d="m20 68 12-3 4 5-13 3z" fill="#b5c2ab" />
        <circle cx="88" cy="57" r="3" fill="#347d75" />
        <path d="m90 55 23-22h20" stroke="#617c65" fill="none" strokeWidth=".6" />
      </svg>
      <p>
        SINGAPORE
        <br />
        Orientation only · not georeferenced
      </p>
    </div>
  );
}
export default function Experience() {
  const [scene, setScene] = useState(initialScene),
    [answer, setAnswer] = useState<Answer>(welcome),
    [question, setQuestion] = useState(''),
    [lastQuestion, setLastQuestion] = useState(''),
    [level, setLevel] = useState<Level>('public');
  const [reading, setReading] = useState(false),
    [quality, setQuality] = useState<boolean | null>(null),
    [ready, setReady] = useState(false),
    [metrics, setMetrics] = useState(''),
    [notice, setNotice] = useState('');
  const reduced = useMedia('(prefers-reduced-motion: reduce)'),
    mobile = useMedia('(max-width: 760px)'),
    low = quality ?? mobile;
  const sourcePanel = useRef<HTMLDetailsElement>(null);
  const execute = useCallback((commands: SceneCommand[]) => {
    setScene((s) => applyCommands(s, commands, registry));
  }, []);
  const run = useCallback(
    (q: string, l: Level = level) => {
      const response = askSingapore(q, l);
      setLastQuestion(q);
      setAnswer(response);
      execute(response.commands);
      setNotice('');
    },
    [level, execute],
  );
  const select = useCallback(
    (id: string) => run(id === 'mrt-context' ? 'show rail context' : 'why depth'),
    [run],
  );
  const onReady = useCallback(() => setReady(true), []),
    onMetrics = useCallback((v: string) => setMetrics(v), []);
  function reset() {
    execute([{ type: 'resetScene' }]);
    setAnswer(welcome);
    setLastQuestion('');
    setNotice('');
  }
  function reveal() {
    if (scene.reveal) reset();
    else run('why was DTSS built?');
  }
  function submit(e: FormEvent) {
    e.preventDefault();
    if (question.trim()) run(question.trim());
  }
  function showSources() {
    if (sourcePanel.current) {
      sourcePanel.current.open = true;
      sourcePanel.current.scrollIntoView({
        behavior: reduced ? 'instant' : 'smooth',
        block: 'start',
      });
    }
  }
  const selected = assets.find((a) => a.asset_id === scene.selected),
    annotation = scene.annotation ? annotations[scene.annotation] : null;
  return (
    <>
      <a className="skip" href="#chapter">
        Skip to chapter controls
      </a>
      <header className="site-header">
        <Link href="/" className="wordmark" aria-label="Unseen Singapore home">
          <span className="mark" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>
            UNSEEN<span>SINGAPORE</span>
          </span>
        </Link>
        <span className="header-note">AN INTERACTIVE ENGINEERING DOCUMENTARY</span>
        <nav className="header-links" aria-label="Main">
          <Link href="/explore">Enter the 3D world ↗</Link>
          <a href="#about">About the project ↗</a>
        </nav>
      </header>
      <main>
        <section className="intro">
          <div>
            <p className="eyebrow">PORTFOLIO CASE STUDY · INTERACTIVE ENGINEERING</p>
            <h1>
              The city you see.
              <br />
              <em>The systems you don’t.</em>
            </h1>
          </div>
          <p className="intro-copy">
            From a first underground cutaway to a national engineering atlas: nine interactive exhibits, five detailed construction journeys, and five eras of Singapore’s story.
          </p>
        </section>
        <section className="portfolio-progress" aria-label="Project development and current experience">
          <div><span className="eyebrow">THE CURRENT EXPERIENCE</span><h2>One island. Nine ways in.</h2><p>5 Detailed · 4 Simplified. Start on the map, enter an engineering environment, and discover why each structure exists.</p><Link href="/explore/">Explore the 3D world ↗</Link></div>
          <div><span className="eyebrow">WHAT HAS GROWN</span><h2>Built to explain.</h2><p>Numbered drawing keys, guided camera views, construction playback, interactive mechanisms, source-linked explanations and clear return navigation.</p></div>
          <div><span className="eyebrow">HOW IT WAS MADE</span><h2>Research to interaction.</h2><p>Human direction and review, with Astra assisting research, code, reproducible Blender authoring and testing. The in-app guide is authored; it is not a live AI service.</p><a href="https://github.com/Darryl-e0697797/unseen-singapore" target="_blank" rel="noreferrer">View the open-source project ↗</a></div>
        </section>
        <section className="exhibit" id="exhibit" aria-label="Interactive engineering exhibit">
          <div className="world-column">
            <div
              className="canvas-shell"
              data-testid="scene"
              data-reveal={scene.reveal}
              data-camera={scene.camera}
              data-tracing={scene.tracing}
              data-selected={scene.selected ?? ''}
            >
              <div className="scene-label">
                <span className="accuracy-badge">SCHEMATIC</span>
                <span className="scene-title">
                  {scene.reveal ? 'Beneath the surface' : 'Singapore-inspired urban section'}
                </span>
                <span className="eyebrow">NOT A SURVEY MODEL</span>
              </div>
              <Orientation />
              {reading ? (
                <div className="scene-fallback">
                  <span className="eyebrow">THE USED-WATER JOURNEY</span>
                  <div className="reading-diagram">
                    <div>01 &nbsp; Local collection</div>
                    <div>02 &nbsp; Deep-tunnel conveyance ↓</div>
                    <div>03 &nbsp; Reclamation / treatment</div>
                    <div>
                      04 &nbsp; Further purification for reuse
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; or treated-effluent discharge
                    </div>
                  </div>
                </div>
              ) : (
                <SceneBoundary>
                  <div
                    className="model-canvas"
                    role="img"
                    aria-label={
                      scene.reveal
                        ? 'Schematic cutaway of deep tunnel, shafts and rail beneath a city'
                        : 'Architectural teaching model of a Singapore-inspired city. Use Reveal the unseen to open the underground section.'
                    }
                  >
                    <World
                      state={scene}
                      low={low}
                      reduced={reduced}
                      onSelect={select}
                      onReady={onReady}
                      onMetrics={onMetrics}
                    />
                  </div>
                  {!ready && (
                    <p className="loading-label" role="status">
                      Loading the generated tunnel…
                    </p>
                  )}
                </SceneBoundary>
              )}
              {!reading && annotation && (
                <div className="scene-annotation">
                  <strong>{annotation[0]}</strong>
                  {annotation[1]}
                  {reduced && scene.tracing ? ' Reduced motion: marker is static.' : ''}
                </div>
              )}
              {!reading && (
                <div className="north">
                  <span aria-hidden="true">↑</span> LOCAL MODEL AXES
                </div>
              )}
              <div className="view-controls">
                <div className="control-pair">
                  <button className="small-button" onClick={reset} aria-label="Reset view">
                    ↺ Reset view
                  </button>
                  <button
                    className="small-button"
                    aria-pressed={reading}
                    onClick={() => setReading((v) => !v)}
                  >
                    {reading ? 'Open 3D' : 'Reading mode'}
                  </button>
                </div>
                <span className="orbit-hint">DRAG TO ORBIT · SCROLL TO ZOOM</span>
              </div>
              <span className="metrics" data-testid="metrics" hidden>
                {metrics}
              </span>
            </div>
            <div className="layers">
              <span className="eyebrow">LAYERS</span>
              <div className="layer-group" aria-label="Scene layers">
                {(['surface', 'dtss', 'mrt'] as const).map((layer) => (
                  <button
                    className="layer"
                    key={layer}
                    aria-pressed={scene.layers[layer]}
                    onClick={() =>
                      execute([
                        { type: 'setLayerVisibility', layer, visible: !scene.layers[layer] },
                      ])
                    }
                  >
                    <span className={`dot ${layer}`} />
                    {layer === 'surface' ? 'Surface' : layer.toUpperCase()}
                  </button>
                ))}
              </div>
              <button
                className="small-button"
                aria-label="Low graphics quality"
                aria-pressed={low}
                onClick={() => setQuality(!low)}
              >
                {low ? 'Low detail' : 'High detail'}
              </button>
            </div>
          </div>
          <article className="chapter" id="chapter">
            <div className="chapter-top">
              <span className="eyebrow">DEEP TUNNEL SEWERAGE SYSTEM</span>
              <span className="chapter-index">DTSS PREVIEW</span>
            </div>
            <div className="levels" aria-label="Explanation level">
              {(['public', 'student', 'engineer', 'planning'] as const).map((l) => (
                <button
                  key={l}
                  aria-pressed={level === l}
                  onClick={() => {
                    setLevel(l);
                    run(lastQuestion || 'why was DTSS built?', l);
                  }}
                >
                  {l === 'public'
                    ? 'Everyone'
                    : l === 'planning'
                      ? 'Planning'
                      : l[0].toUpperCase() + l.slice(1)}
                </button>
              ))}
            </div>
            <div aria-live="polite" aria-atomic="true">
              <h2>{answer.title}</h2>
              <p className="chapter-deck">{answer.narrative}</p>
            </div>
            <button className="reveal-button" aria-pressed={scene.reveal} onClick={reveal}>
              <span>{scene.reveal ? 'Return to the surface' : 'Reveal the unseen'}</span>
              <span aria-hidden="true">{scene.reveal ? '↑' : '↓'}</span>
            </button>
            <div className="suggestions">
              <button onClick={() => run('why was this built?')}>
                <span>Why was this built?</span>
                <span aria-hidden="true">↗</span>
              </button>
              <button
                onClick={() => {
                  if (scene.tracing)
                    execute([{ type: 'traceSystem', system: 'dtss', enabled: false }]);
                  else run('follow one drop');
                }}
              >
                <span>{scene.tracing ? 'Pause the journey' : 'Follow one drop'}</span>
                <span aria-hidden="true">{scene.tracing ? 'Ⅱ' : '→'}</span>
              </button>
              <button onClick={() => run('show rail context')}>
                <span>What else is underground?</span>
                <span aria-hidden="true">↗</span>
              </button>
            </div>
            <form className="ask-form" onSubmit={submit}>
              <div className="ask-heading">
                <label htmlFor="question">Ask Singapore</label>
                <span className="guide-label">AUTHORED GUIDE</span>
              </div>
              <div className="ask-input">
                <input
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  maxLength={500}
                  placeholder="Why are the tunnels so deep?"
                  autoComplete="off"
                />
                <button type="submit" aria-label="Ask question" disabled={!question.trim()}>
                  ↗
                </button>
              </div>
              <p className="privacy-note">
                Curated, sourced explanations. Your question stays on this device.
              </p>
            </form>
            <button className="source-link" onClick={showSources}>
              View sources & model assumptions ↗
            </button>
          </article>
        </section>
        <div className="timeline">
          <span className="eyebrow">SINGAPORE THROUGH TIME</span>
          <div className="era-buttons" aria-label="Temporal coverage">
            {['1930', '1965', '2000', '2026', '2050'].map((year) => (
              <button
                key={year}
                aria-pressed={year === '2026'}
                onClick={() =>
                  year === '2026'
                    ? setNotice(
                        'Present context. This model is representative and has no survey date. PUB lists DTSS Phase 2 commissioning in phases from 2027.',
                      )
                    : setNotice(
                        year === '2050'
                          ? '2050 scenarios are not built yet. They will carry explicit assumptions and an ENVISIONED label.'
                          : `${year} is not modelled yet. Historical views require licensed maps and documented reconstruction assumptions.`,
                      )
                }
              >
                {year}
                {year === '2050' ? ' ↗' : ''}
              </button>
            ))}
          </div>
          <span className="era-note">2026 context · other eras in development</span>
        </div>
        {notice && (
          <div className="notice" role="status">
            <span>{notice}</span>
            <button aria-label="Dismiss notice" onClick={() => setNotice('')}>
              ×
            </button>
          </div>
        )}
        {selected && (
          <div className="notice" data-testid="selection">
            <span>
              <strong>{selected.name}.</strong> {selected.description}
            </span>
          </div>
        )}
        <section className="below" id="about">
          <div>
            <span className="eyebrow">INVISIBLE, NOT INSIGNIFICANT</span>
            <h3>Engineering is a connected story.</h3>
            <p>
              The atlas connects geographic context with construction and operation. Inspect numbered structures, peel open cutaways, trace flows and step through construction sequences. The original DTSS teaching scene above shows where the project began.
            </p>
          </div>
          <div>
            <span className="eyebrow">FIVE DETAILED EXHIBITS</span>
            <h3>From tunnels to a new coastline.</h3>
            <p>
              Explore DTSS, Tuas Port, MRT & underground construction, Marina Barrage and Pulau Tekong. Four simplified exhibits introduce NEWater, Jurong Rock Caverns, power tunnels and coastal resilience.
            </p>
          </div>
          <div>
            <span className="eyebrow">OUR COMMITMENT</span>
            <h3>Clarity before spectacle.</h3>
            <p>
              Every view should say what is known, what is reconstructed and what is schematic.
              Future scenarios will always be labelled.
            </p>
          </div>
        </section>
        <details className="sources" id="sources" ref={sourcePanel}>
          <summary>Sources, accuracy & assumptions</summary>
          <div className="source-records">
            {sources.map((source) => (
              <section key={source.source_id}>
                <p className="eyebrow">
                  PRIMARY SOURCE
                  {answer.source_ids.includes(source.source_id)
                    ? ' · CITED IN THIS EXPLANATION'
                    : ''}
                </p>
                <h3>{source.title}</h3>
                <p>
                  {source.organisation}
                  <br />
                  Accessed {source.access_date}
                  {source.update_date
                    ? ` · Page updated ${source.update_date}`
                    : ' · Publication date not stated'}
                </p>
                <a href={source.url} target="_blank" rel="noreferrer">
                  Read the public source ↗
                </a>
                <p>{source.notes}</p>
                <p>
                  Reuse: {source.redistribution_status}. Agency maps and imagery are not bundled.
                </p>
              </section>
            ))}
          </div>
          <p className="source-legend">
            <strong>DOCUMENTED</strong> — sourced claims. <strong>RECONSTRUCTED</strong> — evidence
            with stated assumptions. <strong>SCHEMATIC</strong> — explanatory geometry.{' '}
            <strong>ENVISIONED</strong> — a future scenario.
            <br />
            All geometry in this chapter is schematic. Buildings, tunnel dimensions, alignments and
            relative depths are illustrative. Moving markers show direction, not calculated flow.
            This is not a hydraulic, structural or transport simulation. Treatment is described
            downstream but not modelled in this cutaway.
          </p>
        </details>
      </main>
      <footer className="footer">
        <span>UNSEEN SINGAPORE · AN INDEPENDENT PROJECT</span>
        <span>No agency endorsement implied. Independent engineering documentary · 2026</span>
      </footer>
    </>
  );
}
