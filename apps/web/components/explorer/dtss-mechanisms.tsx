'use client';
import { useState } from 'react';
export default function DtssMechanisms({ kind }: { kind: 'gate' | 'gravity' }) {
  const [fall, setFall] = useState(55),
    [isolated, setIsolated] = useState(false);
  const y = 85 + fall;
  return (
    <div className="dtss-mechanism">
      {kind === 'gravity' ? (
        <>
          <h4>Read the longitudinal section</h4>
          <svg
            viewBox="0 0 340 220"
            role="img"
            aria-label="Illustrative tunnel falls toward a reclamation plant, where pumps lift flow to treatment"
          >
            <path d="M15 48H325" stroke="#879387" strokeDasharray="3 4" />
            <text x="15" y="35">
              REFERENCE LEVEL
            </text>
            <path d={`M20 85L285 ${y}`} stroke="#728b86" strokeWidth="23" />
            <path d={`M20 85L285 ${y}`} stroke="#71cabc" strokeWidth="7" />
            <path
              className="diagram-flow"
              d={`M20 85L285 ${y}`}
              stroke="#edf3c9"
              strokeWidth="3"
              strokeDasharray="3 22"
            />
            <path d={`M285 ${y}V60H323`} fill="none" stroke="#deb978" strokeWidth="4" />
            <path d="M280 69L285 60L290 69" fill="none" stroke="#deb978" strokeWidth="3" />
            <circle cx="285" cy={y} r="10" fill="#183e40" stroke="#deb978" />
            <text x="281" y={y + 4}>
              P
            </text>
            <text x="18" y="70">
              UPSTREAM
            </text>
            <text x="160" y={y + 23}>
              TOWARD WRP →
            </text>
            <text x="260" y="35">
              TREATMENT
            </text>
            <text x="16" y="203">
              FALL EXAGGERATED · NOT TO SCALE
            </text>
          </svg>
          <label>
            Exaggerate the fall{' '}
            <input
              aria-label="Illustrative fall exaggeration"
              type="range"
              min="15"
              max="80"
              value={fall}
              onChange={(e) => setFall(Number(e.target.value))}
            />
          </label>
          <p>
            The surface stays level while the tunnel falls. Increasing the drawing’s fall reveals
            the principle; it does not set the real tunnel slope or simulate flow. No numerical DTSS
            gradient has been verified here.
          </p>
          <a
            href="https://www.nea.gov.sg/media/news/news/index/pub-and-nea-to-call-over-s5-billion-in-tenders-for-tuas-nexus"
            target="_blank"
            rel="noreferrer"
          >
            PUB/NEA: deep inflow and pumping to treatment ↗
          </a>
        </>
      ) : (
        <>
          <h4>Keep collecting during maintenance</h4>
          <button aria-pressed={isolated} onClick={() => setIsolated(!isolated)}>
            {isolated ? 'Return to normal conveyance' : 'Illustrate isolation & diversion'}
          </button>
          <svg
            viewBox="0 0 340 175"
            role="img"
            aria-label={
              isolated
                ? 'Schematic flow diverted around an isolated tunnel section through link sewers'
                : 'Schematic normal flow along the deep tunnel; gates not deployed'
            }
          >
            <path d="M20 110H320" stroke="#698d86" strokeWidth="14" />
            <path
              d="M80 110V55H255V110"
              stroke={isolated ? '#74d5bd' : '#486963'}
              strokeWidth="7"
              fill="none"
            />
            <path
              className="diagram-flow"
              d={isolated ? 'M20 110H80V55H255V110H320' : 'M20 110H320'}
              stroke="#eef0c8"
              strokeWidth="3"
              strokeDasharray="3 15"
              fill="none"
            />
            {isolated && (
              <>
                <path d="M100 96V124M235 96V124" stroke="#e2b86f" strokeWidth="6" />
                <text x="108" y="143">
                  ISOLATED SECTION
                </text>
              </>
            )}
            <text x="84" y="35">
              LINK-SEWER DIVERSION
            </text>
            <text x="20" y="166">
              LOGIC DIAGRAM · NO VERIFIED ALIGNMENT
            </text>
          </svg>
          <p>
            Gate shafts permit isolation. This diagram explains PUB’s diversion principle; the
            number and positions of gates in a real isolation plan depend on the selected section.
          </p>
          <h4>Air has its own pathway</h4>
          <p>
            <b>Air jumper:</b> moves link-sewer air into the tunnel.
            <br />
            <b>Odour-control facility:</b> extracts air, treats it, then releases treated air. These
            are different functions, not a bare vent discharging untreated tunnel air.
          </p>
          <a
            href="https://www.pub.gov.sg/-/media/PUB/DTSS/PDF/DTSS_Ph2_18Feb2016.pdf#page=57"
            target="_blank"
            rel="noreferrer"
          >
            PUB design presentation: air and gates, pp. 57–66 ↗
          </a>
        </>
      )}
    </div>
  );
}
