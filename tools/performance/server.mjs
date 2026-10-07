import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { gzipSync } from 'node:zlib';

export async function serve(directory, port = 0) {
  const root = resolve(directory);
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json', '.webp': 'image/webp', '.avif': 'image/avif', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.pdf': 'application/pdf' };
  const server = http.createServer(async (req, res) => {
    try {
      let file = resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
      if (file !== root && !file.startsWith(root + sep)) { res.writeHead(403).end(); return; }
      if (!extname(file)) file = resolve(root, 'index.html');
      const body = await readFile(file);
      const compress = /\.(html|js|css|json|svg)$/.test(file) && (req.headers['accept-encoding'] || '').includes('gzip');
      res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store', ...(compress ? { 'Content-Encoding': 'gzip' } : {}) });
      res.end(compress ? gzipSync(body, { level: 6 }) : body);
    } catch { res.writeHead(404).end('Not found'); }
  });
  await new Promise(resolve => server.listen(port, '127.0.0.1', resolve));
  return { url: `http://127.0.0.1:${server.address().port}`, close: () => new Promise(resolve => server.close(resolve)) };
}

export const executablePath = process.env.CHROME_PATH || '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser';
