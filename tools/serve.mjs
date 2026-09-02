import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number.parseInt(process.env.PORT ?? '8080', 10);
const HOST = process.env.HOST ?? '127.0.0.1';

const MIME_TYPES = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.mjs', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.svg', 'image/svg+xml; charset=utf-8'],
  ['.b64', 'text/plain; charset=utf-8'],
  ['.webp', 'image/webp'],
  ['.png', 'image/png'],
  ['.mp4', 'video/mp4']
]);

function sendText(response, status, message) {
  response.writeHead(status, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  response.end(message);
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`);
    const pathname = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname);
    const filePath = resolve(ROOT, `.${pathname}`);

    if (filePath !== ROOT && !filePath.startsWith(`${ROOT}${sep}`)) {
      sendText(response, 403, 'Forbidden');
      return;
    }

    const details = await stat(filePath);
    if (!details.isFile()) {
      sendText(response, 404, 'Not found');
      return;
    }

    response.writeHead(200, {
      'Content-Type': MIME_TYPES.get(extname(filePath).toLowerCase()) ?? 'application/octet-stream',
      'Content-Length': details.size,
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff'
    });

    createReadStream(filePath).pipe(response);
  } catch (error) {
    const status = error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT' ? 404 : 500;
    sendText(response, status, status === 404 ? 'Not found' : 'Internal server error');
  }
});

server.listen(PORT, HOST, () => {
  console.log(`First Empire is available at http://${HOST}:${PORT}`);
});
