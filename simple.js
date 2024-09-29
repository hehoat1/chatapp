// simple-server.js
import http from 'http';

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(2006, '127.0.0.1', () => {
  console.log('Server running at http://127.0.0.1:2006/');
});

