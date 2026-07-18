const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const DEFAULT_PORT = process.env.PORT || 3000;

// Serve static files from the SDMLS-main directory
const publicDir = path.join(__dirname, 'SDMLS-main');

// Clean URLs middleware
app.use((req, res, next) => {
  const ext = path.extname(req.path);
  if (!ext) {
    const htmlPath = path.join(publicDir, req.path + '.html');
    if (fs.existsSync(htmlPath)) {
      req.url += '.html';
    }
  }
  next();
});

app.use(express.static(publicDir));

function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is in use, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error(err);
    }
  });
}

startServer(DEFAULT_PORT);
