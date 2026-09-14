'use client';
import DtssMechanisms from './dtss-mechanisms';
export const dtssStops = [
  {
    title: 'A city above. A system below.',
    label: 'The whole section',
    camera: [53, 36, 65],
    target: [0, 12, 0],
    text: 'Follow local collection through link sewers and deep tunnels to reclamation. This composite combines Phase 1 construction principles with Phase 2 features; it is not one contract layout. The crane-equipped shaft demonstrates construction access; the second shaft demonstrates gate isolation for maintenance. They are placed together for comparison, not as a verified pair of neighbouring shafts. Distances are compressed, and construction equipment is shown as a reference rather than an operating sewer condition.',
    why: 'Going deep creates room for a long-lived collection network while keeping valuable surface land available.',
    source: 'https://www.pub.gov.sg/Professionals/Requirements/Used-Water/DTSS',
  },
  {
    title: 'The vertical construction gateway',
    label: 'Shaft & link sewer',
    camera: [-43, 28, 33],
    target: [-26, 14, 0],
    text: 'A shaft connects the worksite to the tunnel horizon. Construction lifting equipment lowers materials and serves tunnelling operations. The smaller link sewer brings used water from the local network into the deep system; its drop connection is shown schematically.',
    why: 'Shafts make deep construction possible without opening a trench along the whole tunnel.',
    source: 'https://www.pub.gov.sg/Professionals/Requirements/Used-Water/DTSS',
  },
  {
    title: 'Build the void, then support it',
    label: 'Boring machine',
    camera: [43, 14, 19],
    target: [25, 4, 0],
    text: 'Inspect the cutter face, protective shield, thrust jacks and backup deck. The machine excavates while the completed lining provides structural support behind it. This machine is an explanatory assembly, not a replica of a particular DTSS contract machine.',
    why: 'Excavation, ground control, spoil removal and ring installation have to work as one coordinated cycle.',
    source: 'https://www.nas.gov.sg/archivesonline/data/pdfdoc/MSE_20010120001.pdf',
  },
  {
    title: 'More than a concrete pipe',
    label: 'Rings & protection',
    camera: [7, 11, 22],
    target: [2, 4, 0],
    text: 'The cut edge separates the structural ring from the inner protection. PUB describes a secondary tunnel lining that improves resilience in the corrosive used-water environment. Seams and bolts explain assembly; their dimensions and pattern here are illustrative.',
    why: 'The structure must carry ground loads while its inner surface survives decades of exposure.',
    source: 'https://www.pub.gov.sg/Professionals/Requirements/Used-Water/DTSS/ConveyanceSystem',
  },
  {
    title: 'Design for the day it needs attention',
    label: 'Gate & air management',
    camera: [-6, 16, 23],
    target: [-15, 6, 0],
    text: 'PUB reports 32 roller-gate shafts in DTSS 2. Gates are mobilised and assembled on site for isolation; they are not ordinary permanent doors along the tunnel. The second shaft shows an indicative gate shaft and embedded guides; the crane-equipped shaft illustrates construction access. This is a comparison of functions, not evidence that two separate shafts are always required at the same site. Its location and geometry are illustrative. Air management is a separate function: air jumpers transfer air into the tunnel, while odour-control facilities extract and treat it.',
    why: 'A network cannot simply stop serving the city when part of it needs maintenance.',
    source: 'https://www.pub.gov.sg/-/media/PUB/DTSS/PDF/9-DTSS2-TODAY-June-2023.pdf#page=5',
  },
  {
    title: 'Let gravity work. Keep listening.',
    label: 'Flow & monitoring',
    camera: [20, 5, 1],
    target: [-12, 3, 0],
    text: 'Gravity conveys used water toward reclamation plants through a designed hydraulic profile. The construction cutaway is level for component inspection; the section below makes the fall visible. Its adjustable slope is an illustration, not a surveyed DTSS gradient. At Tuas, influent pumps lift the incoming used water to treatment modules. Fibre monitoring concerns structural integrity, not the animated flow speed.',
    why: 'Passive conveyance reduces intermediate pumping, while monitoring helps reveal changes in a hard-to-access structure.',
    source: 'https://www.pub.gov.sg/Professionals/Requirements/Used-Water/DTSS/ConveyanceSystem',
  },
] as const;
// Plain-language descriptions of the existing schematic stops and evidence.
const dtssDrawing = [
  [
    'The whole system',
    'Used water travels from local collection into deep tunnels, then towards water reclamation plants. This is a composite teaching section, not one real site.',
  ],
  [
    'Construction shaft & connecting sewer',
    'The large vertical opening gives workers and lifting equipment access to the tunnel. The smaller connecting sewer brings used water from the local network.',
  ],
  [
    'Tunnel boring machine',
    'The large machine at the tunnel end cuts through the ground. Its shield helps protect the working area while the tunnel lining is installed behind it.',
  ],
  [
    'Concrete rings & protective lining',
    'The rings support the tunnel against the surrounding ground. The inner protection helps the tunnel withstand the used-water environment.',
  ],
  [
    'Maintenance gate shaft & air system',
    'The second shaft illustrates where gates can be brought in to isolate a tunnel section for maintenance. Air transfer and odour treatment are separate functions. This is not a verified pair of neighbouring shafts.',
  ],
  [
    'Gravity flow & monitoring',
    'The direction markers show used water moving towards treatment. The fibre represents structural monitoring. The adjustable fall is exaggerated to explain gravity; it is not the actual tunnel gradient.',
  ],
] as const;
export default function DtssJourney({
  focus,
  onFocus,
}: {
  focus: number;
  onFocus: (n: number) => void;
}) {
  const stop = dtssStops[focus];
  return (
    <section className="dtss-journey" aria-label="DTSS guided component tour">
      <div className="dtss-tour-heading">
        <span>INSIDE THE DEEP TUNNEL</span>
        <b>{String(focus + 1).padStart(2, '0')} / 06</b>
      </div>
      <section className="tuas-drawing-key" aria-label="DTSS drawing key">
        <h4>What am I looking at?</h4>
        <p>
          Match the numbers on the drawing to this key. Select a part to see it more closely and
          learn what it does.
        </p>
        <div>
          {dtssDrawing.map(([name], i) => (
            <button key={name} aria-pressed={i === focus} onClick={() => onFocus(i)}>
              <b>{String(i + 1).padStart(2, '0')}</b>
              {name}
            </button>
          ))}
        </div>
        <article aria-live="polite">
          <h4>
            {String(focus + 1).padStart(2, '0')} · {dtssDrawing[focus][0]}
          </h4>
          <p>{dtssDrawing[focus][1]}</p>
          <small>Illustrative structure · government evidence below</small>
        </article>
      </section>
      <div className="dtss-stop-list">
        {dtssStops.map((s, i) => (
          <button key={s.label} onClick={() => onFocus(i)} aria-pressed={i === focus}>
            {String(i + 1).padStart(2, '0')} <span>{s.label}</span>
          </button>
        ))}
      </div>
      <h3>{stop.title}</h3>
      <p>{stop.text}</p>
      <p className="dtss-why">
        <b>WHY IT MATTERS</b>
        {stop.why}
      </p>
      {(focus === 4 || focus === 5) && <DtssMechanisms kind={focus === 4 ? 'gate' : 'gravity'} />}
      <div className="dtss-tour-footer">
        <a href={stop.source} target="_blank" rel="noreferrer">
          Government · engineering evidence ↗
        </a>
        <button onClick={() => onFocus((focus + 1) % dtssStops.length)}>Next component →</button>
      </div>
    </section>
  );
}
