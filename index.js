const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'urls.json');

let urlMap = {};
if (fs.existsSync(DATA_FILE)) {
  try {
    urlMap = JSON.parse(fs.readFileSync(DATA_FILE));
  } catch (err) {
    console.error('Error reading data file:', err);
  }
}

function saveUrls() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(urlMap, null, 2));
}

function generateSlug() {
  return crypto.randomBytes(3).toString('base64url'); // 6 chars
}

function serveStatic(filePath, res, contentType = 'text/html') {
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      return res.end('Not found');
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
}

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    return serveStatic(path.join(__dirname, 'public', 'index.html'), res);
  }

  if (req.method === 'POST' && req.url === '/shorten') {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      try {
        const { url } = JSON.parse(body);
        if (!url) throw new Error('URL missing');
        let slug = generateSlug();
        while (urlMap[slug]) slug = generateSlug();
        urlMap[slug] = url;
        saveUrls();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ slug }));
      } catch (err) {
        res.writeHead(400);
        res.end('Invalid request');
      }
    });
    return;
  }

  const slugMatch = req.url.slice(1);
  if (req.method === 'GET' && urlMap[slugMatch]) {
    res.writeHead(302, { Location: urlMap[slugMatch] });
    res.end();
    return;
  }

  // Serve static files in /public
  const staticFile = path.join(__dirname, 'public', req.url);
  if (fs.existsSync(staticFile) && fs.statSync(staticFile).isFile()) {
    const ext = path.extname(staticFile);
    const typeMap = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'text/javascript',
    };
    return serveStatic(staticFile, res, typeMap[ext] || 'application/octet-stream');
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
