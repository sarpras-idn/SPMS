const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, 'dist');

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
  let requestPath = decodeURIComponent(req.url.split('?')[0]);

  if (requestPath === '/') {
    requestPath = '/index.html';
  }

  const filePath = path.join(DIST_DIR, requestPath);

  if (!filePath.startsWith(DIST_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      const indexPath = path.join(DIST_DIR, 'index.html');

      fs.readFile(indexPath, (indexError, indexContent) => {
        if (indexError) {
          res.writeHead(500);
          res.end('SPMS build belum tersedia.');
          return;
        }

        res.writeHead(200, {
          'Content-Type': 'text/html; charset=UTF-8',
        });

        res.end(indexContent);
      });

      return;
    }

    const extension = path.extname(filePath).toLowerCase();

    res.writeHead(200, {
      'Content-Type':
        MIME_TYPES[extension] || 'application/octet-stream',
    });

    res.end(content);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`SPMS running on port ${PORT}`);
});