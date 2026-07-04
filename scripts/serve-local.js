const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const port = Number(process.env.PORT || 3000);

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

function resolvePath(urlPath) {
  const cleanPath = decodeURIComponent(urlPath.split('?')[0]);
  const normalized = cleanPath === '/' ? '/index.html' : cleanPath;
  const direct = path.join(root, normalized);
  const htmlFallback = path.join(root, `${normalized}.html`);

  if (fs.existsSync(direct) && fs.statSync(direct).isFile()) return direct;
  if (!path.extname(normalized) && fs.existsSync(htmlFallback)) return htmlFallback;
  return path.join(root, '404.html');
}

http.createServer((req, res) => {
  const filePath = resolvePath(req.url || '/');
  const status = path.basename(filePath) === '404.html' ? 404 : 200;
  const ext = path.extname(filePath).toLowerCase();

  res.writeHead(status, { 'Content-Type': types[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
}).listen(port, '127.0.0.1');
