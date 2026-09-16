// Capture only: agent-browser remains responsible for all app interactions.
// Saves actual CDP frames and timestamps; no generated/interpolated scene frames.
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
const dir=resolve(process.argv[2]); mkdirSync(dir,{recursive:true});
const tabs=await (await fetch('http://127.0.0.1:9223/json/list')).json();
const tab=tabs.find(t=>t.type==='page' && t.url.startsWith(process.env.UNSEEN_CAPTURE_URL ?? 'http://127.0.0.1:3001/explore'));
if(!tab) throw new Error('UNSEEN capture tab not found');
const ws=new WebSocket(tab.webSocketDebuggerUrl); let seq=0; const frames=[]; let stopping=false;
const send=(method,params={})=>ws.send(JSON.stringify({id:++seq,method,params}));
ws.addEventListener('open',()=>{send('Page.enable');send('Page.startScreencast',{format:'jpeg',quality:95,maxWidth:1920,maxHeight:1080,everyNthFrame:1});console.log('CAPTURE READY');});
ws.addEventListener('message',event=>{const m=JSON.parse(event.data);if(m.error)console.error(JSON.stringify(m.error));if(m.method!=='Page.screencastFrame')return;const p=m.params;const file=`frame-${String(frames.length).padStart(6,'0')}.jpg`;writeFileSync(`${dir}/${file}`,Buffer.from(p.data,'base64'));frames.push({file,timestamp:p.metadata.timestamp});send('Page.screencastFrameAck',{sessionId:p.sessionId});});
function stop(){if(stopping)return;stopping=true;send('Page.stopScreencast');setTimeout(()=>{ws.close();writeFileSync(`${dir}/frames.json`,JSON.stringify({tabUrl:tab.url,started:frames[0]?.timestamp,ended:Date.now()/1000,frames},null,2));console.log(`Saved ${frames.length} actual frames`);process.exit(0);},200);}
process.on('SIGINT',stop);process.on('SIGTERM',stop);
setTimeout(stop,Number(process.argv[3]??20000));
