// Minimal dependency-free static server for local development.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('.', import.meta.url));
const port = Number(process.env.PORT) || 4173;
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.svg':'image/svg+xml'};
createServer(async (req,res) => {
  try {
    const requested = decodeURIComponent((req.url || '/').split('?')[0]);
    const candidate = resolve(root, '.' + (requested === '/' ? '/index.html' : requested));
    if (candidate !== resolve(root) && !candidate.startsWith(resolve(root) + sep)) { res.writeHead(403); res.end('Forbidden'); return; }
    if (!(await stat(candidate)).isFile()) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, {'Content-Type': mime[extname(candidate)] || 'application/octet-stream','X-Content-Type-Options':'nosniff'});
    res.end(await readFile(candidate));
  } catch { res.writeHead(404); res.end('Not found'); }
}).listen(port, '127.0.0.1', () => console.log(`Fan Club Name Lab running at http://localhost:${port}`));