import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Railway inyecta dinámicamente PORT
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'; // Requerido para aceptar tráfico en contenedores Railway

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  const safeSuffix = path.normalize(reqPath).replace(/^(\.\.[\/\\])+/, '');

  // Buscar primero en la carpeta 'dist/' generada por Astro, o en la raíz
  const distPath = path.join(__dirname, 'dist', safeSuffix);
  const rootPath = path.join(__dirname, safeSuffix);

  let targetPath = rootPath;
  if (fs.existsSync(distPath) && fs.statSync(distPath).isFile()) {
    targetPath = distPath;
  } else if (fs.existsSync(rootPath) && fs.statSync(rootPath).isFile()) {
    targetPath = rootPath;
  } else {
    // Si no se encuentra y es un asset (.css, .js, .png), responder 404
    const ext = path.extname(reqPath);
    if (ext && ext !== '.html') {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(`404 - Not Found: ${reqPath}`);
      return;
    }

    // Si es una ruta HTML o SPA, servir index.html
    const distIndex = path.join(__dirname, 'dist', 'index.html');
    const rootIndex = path.join(__dirname, 'index.html');
    targetPath = fs.existsSync(distIndex) ? distIndex : rootIndex;
  }

  const ext = path.extname(targetPath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(targetPath, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('500 - Internal Server Error');
      return;
    }
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=86400'
    });
    res.end(content);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`✓ Servidor de Valor y Asociados escuchando en http://${HOST}:${PORT}`);
});
