import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { gzipSync } from 'node:zlib';
const root = resolve('apps/web/.next-static');
const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript', '.mjs':'text/javascript', '.css':'text/css', '.json':'application/json', '.glb':'model/gltf-binary', '.svg':'image/svg+xml', '.png':'image/png', '.woff2':'font/woff2', '.txt':'text/plain' };
createServer(async (req, res) => {
  try {
    let file = resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
    if (file !== root && !file.startsWith(root + sep)) { res.writeHead(403).end(); return; }
    if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
    let body = await readFile(file);
    res.setHeader('Content-Type', types[extname(file)] ?? 'application/octet-stream');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Vary', 'Accept-Encoding');
    if (/gzip/.test(req.headers['accept-encoding'] ?? '') && /\.(html|m?js|css|json|svg|txt)$/.test(file)) {
      body = gzipSync(body); res.setHeader('Content-Encoding', 'gzip');
    }
    res.setHeader('Content-Length', body.length);
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch { res.writeHead(404).end('Not found'); }
}).listen(3003, '127.0.0.1', () => console.log('Compressed static preview: http://127.0.0.1:3003'));
