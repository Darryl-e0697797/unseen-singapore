'use client';
import { useEffect, useState, type ComponentType } from 'react';
import './mobile-gateway.css';

const desktopUrl = 'https://unseen-singapore.darrylkai.chatgpt.site';
export default function MobileGateway() {
  const [World, setWorld] = useState<ComponentType | null>(null);
  const [opening, setOpening] = useState(false);
  const [message, setMessage] = useState('');
  const [videoFailed, setVideoFailed] = useState(false);

  async function launch() {
    setOpening(true);
    try {
      const loaded = await import('./explorer/explorer');
      setWorld(() => loaded.default);
    } catch {
      setMessage('The interactive world could not load. You can still watch the film below.');
    } finally {
      setOpening(false);
    }
  }
  useEffect(() => {
    // Do not mount or fetch the atlas, WebGL scene, or models for phone visitors.
    // Evaluate once: rotating a phone must not unexpectedly launch the full world.
    if (window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches) {
      void import('./explorer/explorer').then((loaded) => setWorld(() => loaded.default)).catch(() => setMessage('The interactive world could not load. Watch the film below.'));
    }
  }, []);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(desktopUrl);
      setMessage('Link copied. Open it on your desktop to explore.');
    } catch {
      setMessage('Copy the website address shown below and open it on your desktop.');
    }
  }

  if (World) return <><a className="gateway-return" href="?preview=1" onClick={(event) => {
    event.preventDefault(); setWorld(null); setMessage('');
  }}>← Back to preview</a><World /></>;

  return <main className="mobile-gateway">
    <header className="gateway-brand">UNSEEN <span>SINGAPORE</span></header>
    <section className="gateway-hero" aria-labelledby="gateway-title">
      <p className="gateway-eyebrow">A NATION, ENGINEERED</p>
      <h1 id="gateway-title">Singapore.<br /><em>Look beneath.</em></h1>
      <p className="gateway-intro">An interactive journey into the engineering beneath a nation. Discover how Singapore builds its tunnels, port, water systems and new land.</p>
      <a className="gateway-watch" href="#showcase">Watch the 60-second film <span aria-hidden="true">↓</span></a>
      <p className="gateway-film-note">Watch on your phone. Explore the full 3D world on desktop.</p>
    </section>
    <section id="showcase" className="gateway-film" aria-label="UNSEEN showcase film">
      <video controls playsInline preload="none" poster="/showcase/poster.jpg" aria-label="UNSEEN Singapore — 60-second showcase" onError={() => setVideoFailed(true)}>
        <source src="/showcase/unseen-60s.mp4" type="video/mp4" onError={() => setVideoFailed(true)} />
        <track kind="captions" src="/showcase/captions.vtt" srcLang="en" label="English" default />
        Your browser does not support this video.
      </video>
      <p className="gateway-film-note">Actual app footage · Illustrative engineering models · Sound optional</p>
      {videoFailed && <p role="status">Video unavailable in this browser. <a href="/showcase/unseen-60s.mp4">Open the film directly</a>, or explore the overview below.</p>}
    </section>
    <section className="gateway-stories" aria-labelledby="stories-title">
      <p className="gateway-eyebrow">FIVE DETAILED JOURNEYS</p>
      <h2 id="stories-title">See how the pieces work together.</h2>
      <ul>
        <li><span>01</span><div><h3>Deep Tunnel Sewerage System</h3><p>Follow used water beneath the city, from collection to treatment.</p></div></li>
        <li><span>02</span><div><h3>MRT & underground construction</h3><p>Look inside tunnel boring and the construction of underground stations.</p></div></li>
        <li><span>03</span><div><h3>Tuas Port</h3><p>Explore caisson placement, reclamation and a working waterfront.</p></div></li>
        <li><span>04</span><div><h3>Marina Barrage</h3><p>Discover how gates and pumps respond to rain and tide.</p></div></li>
        <li><span>05</span><div><h3>Pulau Tekong reclamation</h3><p>Understand the dike, drainage and pumping behind a polder.</p></div></li>
      </ul>
    </section>
    <section className="gateway-desktop" aria-labelledby="desktop-title">
      <p className="gateway-eyebrow">YOUR NEXT STOP</p>
      <h2 id="desktop-title">Best experienced on desktop.</h2>
      <p>The full 3D world is designed for a larger screen, a mouse or trackpad, and a WebGL-capable browser. Watch here, then open this link on your computer.</p>
      <button className="gateway-primary" onClick={copyLink}>Copy desktop link</button>
      <a className="gateway-url" href={desktopUrl}>{desktopUrl.replace('https://', '')}</a>
      <details><summary>Try the full experience on this device</summary><p>The 3D map and models load only when you continue. Performance and touch controls vary by device.</p><button onClick={launch} disabled={opening}>{opening ? 'Opening the world…' : 'Launch full experience'}</button></details>
      <p role="status" className="gateway-status">{message}</p>
    </section>
    <footer>Human direction. Built with GPT-6 Astra.<br /><a href="https://github.com/Darryl-e0697797/unseen-singapore">Explore the open-source project ↗</a></footer>
  </main>;
}
