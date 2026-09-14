'use client';
import { hasDetailedDemo, detailedDemoCount, demoLabel } from './demo-readiness';
import { constructionStages } from '@unseen/world';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from 'react';
import {
  askWorld,
  notebooks,
  eras,
  initialWorld,
  projects,
  researchSources,
  runCommands,
  type Project,
  type WorldState,
} from '@unseen/world';
import { SceneBoundary } from '../scene-boundary';
import './explorer.css';
import ReclamationJourney from './reclamation-journey';
import { initialReclamation, type ReclamationControls } from './reclamation-controls';
import BarrageJourney from './barrage-journey';
import { initialBarrage, type BarrageControls } from './barrage-controls';
import MrtJourney from './mrt-journey';
import { initialMrt, type MrtControls } from './mrt-controls';
import DtssJourney from './dtss-journey';
import { tuasLabels } from './tuas-labels';
import TuasJourney, { initialTuas, type TuasControls } from './tuas-journey';
const SurfaceMap = dynamic(() => import('./surface-map'), {
  ssr: true,
  loading: () => (
    <div className="world-loading">
      <p>Opening the surface atlas…</p>
    </div>
  ),
});
const loadScene = () => import('./scene');
const Scene = dynamic(loadScene, {
  ssr: false,
  loading: () => (
    <div className="world-loading">
      <span>UNSEEN / SINGAPORE</span>
      <p>Preparing your engineering world…</p>
    </div>
  ),
});
function Sources({ ids }: { ids: string[] }) {
  return (
    <div className="chapter-sources">
      {ids.map((id) => {
        const s = researchSources.find((s) => s.source_id === id)!;
        return (
          <a key={id} href={s.url} target="_blank" rel="noreferrer" title={s.title}>
            {s.organisation} ↗
          </a>
        );
      })}
    </div>
  );
}
const subscribeHydration = () => () => {};
export default function Explorer() {
  const hydrated = useSyncExternalStore(subscribeHydration, () => true, () => false);
  const [state, setState] = useState<WorldState>(initialWorld),
    [flight, setFlight] = useState(false),
    [reset, setReset] = useState(0),
    [inspect, setInspect] = useState(false),
    [reduceMotion, setReduceMotion] = useState(false),
    [catalog, setCatalog] = useState(false),
    [chapter, setChapter] = useState(0),
    [panel, setPanel] = useState<'story' | 'timeline' | 'planning' | 'sources'>('story'),
    [question, setQuestion] = useState(''),
    [answer, setAnswer] = useState(''),
    [playing, setPlaying] = useState(false),
    [dtssFocus, setDtssFocus] = useState(0),
    [reclamation, setReclamation] = useState<ReclamationControls>(initialReclamation),
    [barrage, setBarrage] = useState<BarrageControls>(initialBarrage),
    [mrt, setMrt] = useState<MrtControls>(initialMrt),
    [tuas, setTuas] = useState<TuasControls>(initialTuas),
    [mapReset, setMapReset] = useState(0),
    [mapTarget, setMapTarget] = useState<'tuas' | 'mrt' | 'barrage' | 'reclamation' | null>(null);
  const canvasArea = useRef<HTMLDivElement>(null);
  const scroll = useRef<HTMLDivElement>(null);
  const p = projects.find((p) => p.project_id === state.project) ?? null;
  const era = eras.find((e) => e.year === state.year)!;
  const snapshot = p?.snapshots.find((s) => s.year === state.year);
  const dispatch = useCallback(
    (commands: unknown) => setState((s) => runCommands(s, commands)),
    [],
  );
  const stopFlight = useCallback(() => setFlight(false), []);
  const focusDtss = useCallback(
    (n: number) => {
      setDtssFocus(n);
      setInspect(false);
      setFlight(false);
      setPlaying(false);
      dispatch([{ type: 'mode', mode: 'finished' }]);
    },
    [dispatch],
  );
  useEffect(() => {
    const m = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduceMotion(m.matches);
    update();
    m.addEventListener('change', update);
    return () => m.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(
      () =>
        setState((s) => {
          const project = projects.find((p) => p.project_id === s.project);
          if (!project) return s;
          return {
            ...s,
            mode: 'construction',
            stage: (s.stage + 1) % constructionStages(project).length,
          };
        }),
      4500,
    );
    return () => clearInterval(timer);
  }, [playing]);
  const select = useCallback(
    (project: Project) => {
      dispatch([{ type: 'focus', project: project.project_id }]);
      setChapter(0);
      setDtssFocus(0);
      setTuas(initialTuas);
      setBarrage(initialBarrage);
      setReclamation(initialReclamation);
      setMrt(initialMrt);
      setInspect(false);
      setPanel('story');
      setCatalog(false);
      setPlaying(false);
      setFlight(false);
      scroll.current?.scrollTo(0, 0);
    },
    [dispatch],
  );
  function inspectTuas(id: number) {
    const label = tuasLabels.find((l) => l.id === id);
    if (!label) return;
    // Keep the current drawing in place: labels identify components without changing construction state.
    setTuas((v) => ({ ...v, component: id }));
    setPlaying(false);
    setFlight(false);
    requestAnimationFrame(() =>
      scroll.current?.querySelector('.tuas-drawing-key')?.scrollIntoView({ block: 'nearest' }),
    );
  }
  function submit(e: FormEvent) {
    e.preventDefault();
    const a = askWorld(question);
    dispatch(a.commands);
    setAnswer(a.message);
    setPlaying(false);
    setPanel('story');
    setChapter(/why/i.test(question) ? 0 : /how|built|construct/i.test(question) ? 2 : 0);
    setQuestion('');
  }
  function home() {
    setMapTarget(null);
    if (
      p?.project_id === 'tuas' ||
      p?.project_id === 'mrt' ||
      p?.project_id === 'barrage' ||
      p?.project_id === 'reclamation'
    )
      setMapReset((n) => n + 1);
    dispatch([{ type: 'reset' }]);
    setPlaying(false);
    setFlight(false);
    setAnswer('');
  }
  return (
    <main inert={!hydrated} aria-busy={!hydrated} data-interactive={hydrated}
      className={`engineering-world ${p ? 'in-exhibit' : 'on-surface'} ${['dtss', 'tuas', 'mrt', 'barrage', 'reclamation'].includes(p?.project_id ?? '') ? 'dtss-exhibit' : ''} ${p?.project_id === 'tuas' || p?.project_id === 'mrt' || p?.project_id === 'barrage' || p?.project_id === 'reclamation' ? 'tuas-exhibit' : ''} ${p?.project_id === 'mrt' ? 'mrt-exhibit' : ''}`}
    >
      <a className="world-skip" href={p ? '#exhibit-content' : '#world-content'}>
        Skip to the engineering stories
      </a>
      <SurfaceMap
        key={mapReset}
        initialProject={mapTarget}
        year={state.year}
        hidden={!!p}
        onEnter={select}
        onCatalog={() => { setCatalog(true); void loadScene(); }}
        reduceMotion={reduceMotion}
      />
      {p && (
        <>
          <div
            className="world-canvas"
            ref={canvasArea}
            tabIndex={0}
            aria-label={
              p
                ? `Interactive ${p.title} model. Drag to orbit, scroll to zoom.`
                : 'Interactive Singapore orientation map. Use the project catalogue for keyboard navigation.'
            }
          >
            <SceneBoundary>
              <Scene
                onTuasInspect={inspectTuas}
                tuas={tuas}
                mrt={mrt}
                barrage={barrage}
                reclamation={reclamation}
                onReclamationInspect={(id) => setReclamation((v) => ({ ...v, component: id }))}
                onBarrageInspect={(id) => setBarrage((v) => ({ ...v, component: id }))}
                onMrtInspect={(id) => setMrt((v) => ({ ...v, component: id }))}
                dtssFocus={dtssFocus}
                onDtssFocus={focusDtss}
                state={state}
                reveal={false}
                flight={flight}
                reset={reset}
                inspect={inspect}
                reduceMotion={reduceMotion}
                onSelect={select}
                onFlightEnd={stopFlight}
              />
            </SceneBoundary>
          </div>
        </>
      )}
      <header className="world-header">
        <Link href="/" className="world-brand">
          <span className="brand-glyph">
            U<span>\</span>
          </span>
          <span>
            UNSEEN<small>SINGAPORE</small>
          </span>
        </Link>
        <span className="world-header-caption">
          AN ENGINEERING WORLD
          <br />
          <b>01° N / 103° E</b>
        </span>
        <button
          className="world-menu"
          onClick={() => setCatalog(!catalog)}
          aria-expanded={catalog}
          aria-controls="project-catalog"
        >
          {catalog ? 'Close catalogue ×' : 'Explore 9 projects +'}{' '}
        </button>
      </header>
      {p && (
        <div className="exhibit-heading">
          <button onClick={home}>← Back to Singapore</button>
          <p className="world-kicker">
            {p.theme} / EXHIBIT {String(projects.indexOf(p) + 1).padStart(2, '0')}
          </p>
          <h1>{p.short_title}</h1>
          <span>
            {state.year === 2026
              ? 'PRESENT-DAY EXPLANATORY STRUCTURE'
              : `${era.label} STORY LENS · MODEL IS A REFERENCE EXHIBIT`}
          </span>
          {p.project_id === 'coast' && <strong>ENVISIONED — Long Island is a proposal</strong>}
        </div>
      )}
      {p && (
        <>
          <div className="world-tools">
            {p && (
              <button
                onClick={() => setInspect(!inspect)}
                aria-pressed={inspect}
                aria-label={inspect ? 'Wide view' : 'Inspect structure'}
              >
                ⊙ <span>{inspect ? 'Wide view' : 'Inspect structure'}</span>
              </button>
            )}
            <button
              onClick={() => {
                setInspect(false);
                if (p?.project_id === 'tuas') setTuas(initialTuas);
                if (p?.project_id === 'reclamation') {
                  setReclamation(initialReclamation);
                  setPlaying(false);
                  dispatch([{ type: 'mode', mode: 'finished' }]);
                }
                if (p?.project_id === 'barrage') {
                  setBarrage(initialBarrage);
                  setPlaying(false);
                  dispatch([{ type: 'mode', mode: 'finished' }]);
                }
                if (p?.project_id === 'mrt') {
                  setMrt(initialMrt);
                  setPlaying(false);
                  dispatch([{ type: 'mode', mode: 'finished' }]);
                }
                setReset((r) => r + 1);
              }}
              title="Reset camera"
              aria-label="Reset view"
            >
              ↺ <span>Reset view</span>
            </button>
            <button
              className={flight ? 'active' : ''}
              onClick={() => {
                setFlight(!flight);
                canvasArea.current?.focus();
              }}
              aria-pressed={flight}
              aria-label={flight ? 'Exit flight' : 'Enter flight'}
            >
              ⌁ <span>{flight ? 'Exit flight' : 'Enter flight'}</span>
            </button>
            {p && (
              <button
                onClick={() =>
                  dispatch([
                    { type: 'mode', mode: state.mode === 'exploded' ? 'finished' : 'exploded' },
                  ])
                }
                aria-pressed={state.mode === 'exploded'}
                aria-label={state.mode === 'exploded' ? 'Assemble' : 'Explode layers'}
              >
                ↟ <span>{state.mode === 'exploded' ? 'Assemble' : 'Explode layers'}</span>
              </button>
            )}
          </div>
          <div className="world-navigation-note">
            {flight
              ? 'FLIGHT · W A S D to move · Q / E vertical · drag to look · Esc exits'
              : 'DRAG TO ORBIT · SCROLL TO ZOOM · RIGHT-DRAG TO PAN'}
            <span>
              {p
                ? 'Original schematic · representative construction'
                : state.year === 2026
                  ? 'Generalised Natural Earth geography · approximate thematic markers · illustrative buildings'
                  : 'Reference geography stays unchanged · dated project evidence, not a reconstructed historical city'}
            </span>
          </div>
        </>
      )}
      {p && (
        <aside
          className="world-story"
          id="exhibit-content"
          ref={scroll}
          aria-label="Engineering story"
        >
          <div className="story-top">
            <span className="world-kicker">THE ENGINEERING ATLAS</span>
            <button onClick={home} aria-label="Close exhibit">
              ×
            </button>
          </div>
          <h2>{p.title}</h2>
          <p>{demoLabel(p)}{!hasDetailedDemo(p) && ' · An introductory model of the engineering system.'}</p>
          <p className="current-status">{p.current_status}</p>
          <div className="world-metric">
            <b>{p.metric.value}</b>
            <span>{p.metric.label}</span>
          </div>
          <p className="project-summary">{p.summary}</p>
          {p.project_id === 'tuas' && (
            <TuasJourney
              mode={state.mode}
              stage={state.stage}
              onInspect={inspectTuas}
              year={state.year}
              value={tuas}
              onMap={() => {
                setPlaying(false);
                setFlight(false);
                setMapTarget('tuas');
                setState(initialWorld);
              }}
              onChange={(v) => {
                setTuas(v);
                setPlaying(false);
                setFlight(false);
                setInspect(false);
                dispatch([{ type: 'mode', mode: 'finished' }]);
              }}
            />
          )}
          {p.project_id === 'mrt' && (
            <MrtJourney
              value={mrt}
              year={state.year}
              mode={state.mode}
              stage={state.stage}
              reduceMotion={reduceMotion}
              onMap={() => {
                setPlaying(false);
                setFlight(false);
                setMapTarget('mrt');
                setState(initialWorld);
              }}
              onChange={(v) => {
                setMrt(v);
                setPlaying(false);
                setFlight(false);
                setInspect(false);
                if (v.focus !== mrt.focus || v.progress !== mrt.progress || v.method !== mrt.method)
                  dispatch([{ type: 'mode', mode: 'finished' }]);
              }}
            />
          )}
          {p.project_id === 'barrage' && (
            <BarrageJourney
              value={barrage}
              year={state.year}
              mode={state.mode}
              stage={state.stage}
              reduceMotion={reduceMotion}
              onMap={() => {
                setPlaying(false);
                setFlight(false);
                setMapTarget('barrage');
                setState(initialWorld);
              }}
              onChange={(v) => {
                setBarrage(v);
                setPlaying(false);
                setFlight(false);
                setInspect(false);
                if (v.focus !== barrage.focus || v.progress !== barrage.progress)
                  dispatch([{ type: 'mode', mode: 'finished' }]);
              }}
            />
          )}
          {p.project_id === 'reclamation' && (
            <ReclamationJourney
              value={reclamation}
              year={state.year}
              mode={state.mode}
              stage={state.stage}
              reduceMotion={reduceMotion}
              onMap={() => {
                setPlaying(false);
                setFlight(false);
                setMapTarget('reclamation');
                setState(initialWorld);
              }}
              onChange={(v) => {
                setReclamation(v);
                setPlaying(false);
                setFlight(false);
                setInspect(false);
                if (
                  v.focus !== reclamation.focus ||
                  v.progress !== reclamation.progress ||
                  v.weather !== reclamation.weather ||
                  v.comparison !== reclamation.comparison ||
                  v.future !== reclamation.future
                )
                  dispatch([{ type: 'mode', mode: 'finished' }]);
              }}
            />
          )}
          {p.project_id === 'dtss' && <DtssJourney focus={dtssFocus} onFocus={focusDtss} />}
          <div className="story-tabs" role="tablist" aria-label="Exhibit information">
            {(['story', 'planning', 'timeline', 'sources'] as const).map((t) => (
              <button key={t} role="tab" aria-selected={panel === t} onClick={() => setPanel(t)}>
                {t === 'story'
                  ? 'Story'
                  : t === 'timeline'
                    ? 'Through time'
                    : t === 'planning'
                      ? 'Engineering'
                      : 'Evidence'}
              </button>
            ))}
          </div>
          {panel === 'story' && (
            <div className="story-body">
              <div className="chapter-navigation" aria-label="Story chapters">
                {p.chapters.map((c, i) => (
                  <button key={c.title} onClick={() => setChapter(i)} aria-pressed={chapter === i}>
                    <span>0{i + 1}</span>
                    {c.title}
                  </button>
                ))}
              </div>
              <article className="active-chapter">
                <span className={`evidence-tag ${p.chapters[chapter].kind}`}>
                  {p.chapters[chapter].kind === 'documented'
                    ? 'DOCUMENTED / PUBLIC SOURCES'
                    : 'INTERPRETATION / PLANNING LOGIC'}
                </span>
                <h3>{p.chapters[chapter].title}</h3>
                <p>{p.chapters[chapter].body}</p>
                <Sources ids={p.chapters[chapter].source_ids} />
                <button
                  className="chapter-next"
                  onClick={() => setChapter((chapter + 1) % p.chapters.length)}
                >
                  {chapter === 4 ? 'Return to the beginning' : 'Continue the story'} →
                </button>
              </article>
              <section className="construction-panel">
                <div>
                  <span className="world-kicker">BUILD THE STRUCTURE</span>
                  <button
                    onClick={() => {
                      setPlaying(!playing);
                      dispatch([{ type: 'mode', mode: 'construction' }]);
                    }}
                    aria-pressed={playing}
                  >
                    {playing ? 'Pause' : 'Play sequence'} {playing ? 'Ⅱ' : '▷'}
                  </button>
                </div>
                <p>Representative method · steps are illustrative, not a contract programme.</p>
                <div className="stage-buttons">
                  {constructionStages(p).map((s, i) => (
                    <button
                      key={s.title}
                      aria-label={`Construction stage ${i + 1}: ${s.title}`}
                      aria-pressed={state.mode === 'construction' && state.stage === i}
                      onClick={() => {
                        setPlaying(false);
                        dispatch([{ type: 'stage', stage: i }]);
                      }}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <h4>{constructionStages(p)[state.stage].title}</h4>
                <p>{constructionStages(p)[state.stage].body}</p>
                <button
                  className="text-button"
                  onClick={() => {
                    setPlaying(false);
                    if (p.project_id === 'mrt') setMrt(initialMrt);
                    dispatch([{ type: 'mode', mode: 'finished' }]);
                  }}
                >
                  Show completed reference model ↗
                </button>
              </section>
            </div>
          )}
          {panel === 'planning' && (
            <div className="story-body">
              <span className="evidence-tag interpretation">
                ENGINEER’S NOTEBOOK / EXPLANATORY ANALYSIS
              </span>
              <p className="evidence-note">
                A deeper reading of the public evidence. Planning questions are our interpretation,
                not disclosed contract requirements.
              </p>
              {notebooks[p.project_id].map((note, i) => (
                <article className="notebook-entry" key={note.title}>
                  <span>0{i + 1}</span>
                  <h3>{note.title}</h3>
                  <p>{note.body}</p>
                </article>
              ))}
              <Sources ids={p.source_ids} />
            </div>
          )}
          {panel === 'timeline' && (
            <div className="story-body">
              <div className="era-callout">
                <span>
                  {era.label} / {snapshot!.status.replaceAll('-', ' ')}
                </span>
                <h3>{era.title}</h3>
                <p>{snapshot!.summary}</p>
                <Sources ids={snapshot!.source_ids} />
              </div>
              <h3 className="milestone-heading">The project chronology</h3>
              <ol className="milestones">
                {p.events.map((e, i) => (
                  <li key={i}>
                    <b>{e.year}</b>
                    <div>
                      {e.target && <span className="evidence-tag">OFFICIAL TARGET</span>}
                      <p>{e.title}</p>
                      <Sources ids={[e.source_id]} />
                    </div>
                  </li>
                ))}
              </ol>
              <p className="evidence-note">
                The era control changes the evidence lens. A finished reference exhibit is not
                evidence that the project existed in the selected year.
              </p>
            </div>
          )}
          {panel === 'sources' && (
            <div className="story-body">
              <p className="evidence-note">
                Researched 14 September 2026. Independent educational work; no agency endorsement.
                Geometry is original and schematic. Sources support the story, not model dimensions
                or alignment.
              </p>
              <p>{p.location_note}</p>
              {p.source_ids.map((id) => {
                const s = researchSources.find((s) => s.source_id === id)!;
                return (
                  <article className="source-record" key={id}>
                    <span>
                      {s.reliability_level} / {s.organisation}
                    </span>
                    <a href={s.url} target="_blank" rel="noreferrer">
                      {s.title} ↗
                    </a>
                    <p>{s.notes}</p>
                    <small>
                      Accessed {s.access_date} ·{' '}
                      {s.redistribution_status === 'permitted'
                        ? 'Reuse permitted'
                        : 'Reference text; media reuse not cleared'}
                    </small>
                  </article>
                );
              })}
            </div>
          )}
          <form className="world-ask" onSubmit={submit}>
            <label htmlFor="world-question">
              Ask Singapore <small>AUTHORED SPATIAL GUIDE</small>
            </label>
            <div>
              <input
                id="world-question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="How was Tuas Port built?"
                maxLength={500}
              />
              <button aria-label="Ask Singapore" type="submit">
                ↗
              </button>
            </div>
            {answer && <p role="status">{answer}</p>}
          </form>
        </aside>
      )}
      <footer className="world-timeline">
        <div className="timeline-label">
          <span>TRAVEL THROUGH TIME</span>
          <b>{era.title}</b>
        </div>
        <div className="era-buttons" aria-label="Select historical or future era">
          {eras.map((e) => (
            <button
              key={e.year}
              aria-pressed={state.year === e.year}
              onClick={() => {
                dispatch([{ type: 'era', year: e.year }]);
                if (p) setPanel('timeline');
              }}
            >
              <i />
              <span>{e.label}</span>
              <small>
                {e.year === 2050
                  ? 'SCENARIOS'
                  : e.year === 2026
                    ? 'PRESENT'
                    : e.year === 1958
                      ? '1958 PLAN'
                      : 'HISTORY'}
              </small>
            </button>
          ))}
        </div>
        <button
          className="timeline-expand"
          onClick={() => setCatalog(true)}
          aria-label="Open timeline for all nine projects"
        >
          All projects ↗
        </button>
      </footer>
      {catalog && (
        <section
          className="world-catalog"
          id="project-catalog"
          aria-label="All engineering projects"
        >
          <div className="catalog-header">
            <span className="world-kicker">THE ENGINEERING ATLAS / {era.label}</span>
            <button onClick={() => setCatalog(false)} aria-label="Close project catalogue">
              ×
            </button>
          </div>
          <h2>
            Nine ways to see
            <br />
            Singapore differently.
          </h2>
          <p>{detailedDemoCount} Detailed · {projects.length - detailedDemoCount} Simplified</p>
          <p>{era.body}</p>
          <Sources ids={era.source_ids} />
          <div className="catalog-list">
            {projects.map((project, i) => {
              const snap = project.snapshots.find((s) => s.year === state.year)!;
              return (
                <button key={project.project_id} onClick={() => select(project)}>
                  <span className="catalog-number" style={{ color: project.color }}>
                    0{i + 1}
                  </span>
                  <span>
                    <strong>{project.title}</strong>
                    <small>{demoLabel(project)}</small>
                    <small>
                      {snap.status.replaceAll('-', ' ')} / {project.theme}
                    </small>
                    <p>{snap.summary}</p>
                  </span>
                  <b>↗</b>
                </button>
              );
            })}
          </div>
          <div className="timeline-matrix">
            <h3>Every project, across every era</h3>
            <p>
              O operating · B building / demonstration · P planning · — pre-project / context · F
              future scenario or target
            </p>
            <table>
              <thead>
                <tr>
                  <th>System</th>
                  {eras.map((e) => (
                    <th key={e.year}>{e.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.project_id}>
                    <th>{project.theme}</th>
                    {project.snapshots.map((s) => (
                      <td key={s.year}>
                        <button
                          title={s.summary}
                          onClick={() => {
                            select(project);
                            dispatch([{ type: 'era', year: s.year }]);
                            setPanel('timeline');
                          }}
                        >
                          {s.year === 2050
                            ? 'F'
                            : s.status === 'operating'
                              ? 'O'
                              : ['construction', 'demonstration', 'mixed'].includes(s.status)
                                ? 'B'
                                : s.status === 'planning'
                                  ? 'P'
                                  : '—'}
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}
